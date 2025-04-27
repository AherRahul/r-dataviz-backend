interface ToolSchema {
  name: string;
  description: string;
  input_schema: {
    type: 'object',
    properties: Record<string, unknown>,
    required: string[]
  }
}

export const MODEL_TOOLS: ToolSchema[] = [
  {
    name: 'generate_graph_data',
    description: 'Generate structured JSON data for creating charts and graphs.',
    input_schema: {
      type: 'object' as const,
      properties: {
        chartType: {
          type: 'string' as const,
          enum: ['number', 'bar', 'line', 'pie'] as const,
          description: 'The type of chart to generate'
        },
        chart: {
          type: 'object' as const,
          properties: {
            title: { type: 'string' as const },
            xAxis: { type: 'string' as const },
            yAxis: { type: 'string' as const },
            data: {
              oneOf: [
                {
                  type: 'number' as const
                },
                {
                  type: 'array' as const,
                  items: {
                    type: 'object' as const,
                    additionalProperties: true
                  }
                }
              ]
            },
          },
          required: ['title', 'xAxis', 'yAxis', 'data']
        }
      },
      required: ['chartType', 'chart']
    }
  }
];

// This is the chart prompt that will be combined with the user-specific prompt
export const CHART_TYPE_PROMPTS = {
  'number': `
Analyze this time-series data and create a number visualization that:
  1. Showing count of a field
  2. Return the value as the sum of each value

  Generate the data in this structure:
  {
    "chartType": "number",
    "chart": {
      "title": "[Clear, descriptive title]",
      "data": 80
    }
}`,

  'line': `
Analyze this time-series data and create a line chart visualization that:
1. Shows clear trends over time
2. Highlights key inflection points
3. Includes proper date/time formatting on the x-axis
4. Uses meaningful scale on the y-axis
5. Captures the overall pattern while preserving important details

Generate the data in this structure:
{
  "chartType": "line",
  "chart": {
    "title": "[Clear, descriptive title]",
    "xAxis": "[Time unit - e.g., Date, Month, Year]",
    "yAxis": "[Metric being measured]",
    "data": [
        {"[xAxis]": "[timestamp]", "[yAxis]": [value]},
        ...
    ]
  }
}`,

  'bar': `
Analyze this categorical data and create a grouped column chart that:
1. Shows vertical comparisons between categories
2. Displays clear value relationships
3. Uses logical grouping
4. Maintains clear spacing
5. Emphasizes key differences

Generate the data in this structure:
{
    "chartType": "bar",
    "chart": {
      "title": "[Clear, descriptive title]",
      "xAxis": "[Category name]",
      "yAxis": "[Metric being compared]",
      "data": [
          {"[xAxis]": "[category]", "[yAxis]": [value]},
          ...
      ]
    }
}`,

  'pie': `
Analyze this distribution data and create a pie chart that:
1. Shows clear segment proportions
2. Uses logical grouping of smaller segments
3. Highlights significant segments
4. Maintains readable labels
5. Represents the total distribution effectively

Generate the data in this structure:
{
    "chartType": "pie",
    "chart": {
      "title": "[Clear, descriptive title]",
      "xAxis": "segment",
      "yAxis": "value",
      "data": [
        {"segment": "[category name]", "value": [numeric value], color: '#fff4345'},
        ...
      ]
    }
}`
}

export const SYSTEM_PROMPT = `You are a data visualization expert. Your role is to analyze data and create clear, meaningful visualizations using generate_graph_data tool:

Here are the chart types available and their idea use cases:

1. NUMBER ("number")
   - Data showing count of a field

2. LINE CHARTS ("line")
   - Time series data showing trends
   - Financial metrics over time
   - Market performance tracking

3. BAR CHARTS ("bar")
   - Single metric comparisons
   - Period-over-period analysis
   - Category performance

4. PIE CHARTS ("pie")
   - Distribution analysis
   - Market share breakdown
   - Portfolio allocation

When generating visualizations:
1. Structure data correctly based on the chart type
2. Use descriptive titles and clear descriptions
3. Include trend information when relevant (percentage and direction)
4. Use proper data keys that reflect actual metrics

Data Structure Examples:

For Time-Series (line/bar):
{
  chart: {
    title: "Top 10 most followed teams",
    xAxis: "Name",
    yAxis: "Age",
    data: [
      {[xAxis]: "Arsenal F.C.", [yAxis]: 88},
      {[xAxis]: "Chelsea", [yAxis]: 80},
    ],
  }
}

For Distributions (pie):
{
  chart: {
    title: "Portfolio Allocation",
    xAxis: "segment",
    yAxis: "value",
    data: [
      { segment: "Equities", value: 5500000, color: '#fg735d' },
      { segment: "Bonds", value: 3200000, color: '#4aa1f3' }
    ],
  }
}

Always:
- Generate real, contextually appropriate data
- Use proper formatting
- Include relevant trends and insights
- Structure data exactly as needed for the chosen chart type
- Use the specified visualization for the data

Never:
- Use placeholder or static data
- Announce the tool usage
- Include technical implementation details in responses
- NEVER SAY you are using the generate_graph_data tool, just execute it when needed.

Focus on clear insights and let the visualization enhance understanding.

`;

export const sqlPromptMessage = (schema: string, userPrompt: string): string => {
  const content = `You are a SQL expert. Based on this database schema:

${schema}

Generate a SQL query to answer this question: "${userPrompt}"

Requirements:
1. For SELECT, use * instead of column name in the SQL statement
2. Return ONLY the SQL query, nothing else
3. Ensure it's a valid PostgreSQL query
4. Use appropriate JOINS when needed
5. Include proper WHERE clauses for filtering
6. Add ORDER BY clauses when relevant
7. Use appropriate aggregations (COUNT, SUM, AVG, etc.)
8. Include LIMIT clause if result set could be large`;
  return content;
};

export const generateChartPrompt = (userPrompt: string, chartType: string, chartPrompt: string, data: string): string => {
  const message = `
Chart Type Required: ${chartType} chart

User Request:
${userPrompt}

Visualization Requirements:
${chartPrompt}

Data to visualize:
${data}

Important: This data MUST be visualized as a ${chartType} chart.`;
  return message;
};

export const sqlGeneratorPrompt = (schema: string, prompt: string): string => {
  const message = `You are a SQL expert. Based on this database schema:

${schema}

Generate a SQL query to answer this question: "${prompt}"

Requirements:
1. Return ONLY the SQL query, nothing else
2. Ensure it's a valid PostgreSQL query
3. Use appropriate JOINS when needed
4. Include proper WHERE clauses for filtering
5. Add ORDER BY clauses when relevant
6. Use appropriate aggregations (COUNT, SUM, AVG, etc.)
7. Include LIMIT clause if result set could be large
8. Return the appropriate field names in the data.
9. If the prompt has a text that is contained the in table column, the column should be part of the response.
`;
  return message;
}
