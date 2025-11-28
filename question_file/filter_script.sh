#!/bin/bash

# Check if input and output files are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <input_file.json> <output_file.json>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found"
    exit 1
fi

# Use jq to filter the array and keep only objects with question_type
jq '[.[] | select(has("question_type"))]' "$INPUT_FILE" > "$OUTPUT_FILE"

# Check if jq command was successful
if [ $? -eq 0 ]; then
    echo "✓ Successfully filtered JSON"
    echo "✓ Output saved to: $OUTPUT_FILE"
    echo "✓ Filtered items: $(jq 'length' "$OUTPUT_FILE")"
else
    echo "Error: Failed to process JSON file"
    exit 1
fi
