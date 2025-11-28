import { connectDB } from '@/lib/db';
import { StudentProgress } from '@/lib/schemas/student-progress.schema';
import { Score } from '@/lib/schemas/score.schema';
import { Exam } from '@/lib/schemas/exam.schema';
import { Question } from '@/lib/schemas/question.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { examId, scoreId, cheatingAttempts, terminatedForCheating, answers: submittedAnswers } = await request.json();

    // Find the score record
    const score = await Score.findById(scoreId);

    if (!score) {
      return NextResponse.json({ error: 'Score record not found' }, { status: 404 });
    }

    if (score.studentId.toString() !== currentUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // 1. Prepare to grade
    let correctCount = 0;
    
    // Arrays for legacy support
    const incorrectAnswersLegacy = [];
    const correctAnswersLegacy = [];
    
    // New unified array that will store EVERYTHING (Attempted + Skipped)
    const processedAnswers = [];

    // 2. Fetch all Question documents from DB to get the correct answers
    // We use score.questions (assigned questions) as the source of truth for the exam structure
    const assignedQuestions = score.questions && score.questions.length > 0 
      ? score.questions 
      : []; 

    // Fallback: if score.questions is empty (legacy data), use submitted answers keys
    const questionsToGrade = assignedQuestions.length > 0 
      ? assignedQuestions 
      : submittedAnswers.map((a: any) => ({ _id: a.questionId }));

    const questionIds = questionsToGrade.map((q: any) => q._id);
    const dbQuestions = await Question.find({ _id: { $in: questionIds } });
    const dbQuestionsMap = new Map(dbQuestions.map(q => [q._id.toString(), q]));

    // 3. Create a map of the student's submission for O(1) lookup
    const submissionMap = new Map(submittedAnswers.map((a: any) => [a.questionId, a.selectedAnswer]));

    // 4. Iterate through ALL assigned questions (ensures skips are recorded)
    for (const assignedQ of questionsToGrade) {
      const qId = assignedQ._id.toString();
      const question = dbQuestionsMap.get(qId);
      
      if (!question) continue; // Question might have been deleted from DB

      // Check if student answered this question
      const hasAnswered = submissionMap.has(qId);
      const selectedAnswer = submissionMap.get(qId);

      let isCorrect = false;

      if (hasAnswered && selectedAnswer !== null && selectedAnswer !== undefined) {
        // Normalize to array to handle single/multi choice uniformly
        const correctArr = Array.isArray(question.answer) ? question.answer : [question.answer];
        const selectedArr = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];

        // Robust check: same length AND every selected item is in correct array
        isCorrect = correctArr.length === selectedArr.length &&
          selectedArr.every((ans: any) => correctArr.includes(ans));
      }

      // Populate Legacy fields
      if (isCorrect) {
        correctCount++;
        correctAnswersLegacy.push(question._id);
      } else {
        incorrectAnswersLegacy.push({
          questionId: question._id,
          selectedAnswer: hasAnswered ? selectedAnswer : null,
          correctAnswer: question.answer
        });
      }

      // Populate New Unified Field
      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: hasAnswered ? selectedAnswer : null, // Records null if skipped
        correctAnswer: question.answer,
        isCorrect: isCorrect
      });
    }

    const normalizedScore = (correctCount / exam.numberOfQuestion) * 1000;

    // Update the score record
    score.rawScore = correctCount;
    score.normalizedScore = Math.round(normalizedScore);
    
    // Save new data (Primary source of truth now)
    score.answers = processedAnswers; 
    
    // Save legacy data (safety net)
    score.correctAnswers = correctAnswersLegacy;
    score.incorrectAnswers = incorrectAnswersLegacy;
    
    score.cheatingAttempts = cheatingAttempts;
    score.terminatedForCheating = terminatedForCheating;
    score.status = 'finished';
    score.completedAt = new Date();

    await score.save();

    // Delete the progress record
    await StudentProgress.deleteOne({
      studentId: currentUser.userId,
      examId
    });

    return NextResponse.json({
      score: {
        id: score._id,
        normalizedScore: score.normalizedScore,
        rawScore: score.rawScore,
        totalQuestions: exam.numberOfQuestion,
        passed: normalizedScore >= exam.passingScore
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
  }
}