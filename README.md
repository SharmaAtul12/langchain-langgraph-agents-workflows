# LangChain and LangGraph Examples

A small Node.js learning repository for building LLM agents and deterministic workflows with LangChain, LangGraph, OpenAI, Tavily, and Notion.

The examples are intentionally kept close to the underlying APIs. The `notes/` directory contains chapter-by-chapter explanations, while `src/` contains runnable examples.

## What is included

### Tool-using chat agent

`src/index.js` creates a LangChain agent using the `gpt-4o-mini` model. The agent can call two Tavily-backed tools:

- `web_search`: searches the web and returns the top five results.
- `visit_page`: extracts readable Markdown content from a URL.

The program runs in the terminal and accepts questions until you enter `exit`.

### Research-to-Notion workflow

`src/workflows/workflow.js` creates a LangGraph state graph with two nodes:

1. `writeNotes` searches Tavily for a topic and asks OpenAI to turn the results into Markdown study notes.
2. `saveToNotion` splits the notes into Notion-sized paragraph blocks and creates a page beneath the configured parent page.

The workflow then prints the created Notion page URL.

## Requirements

- Node.js 18 or newer (the workflow uses the built-in `fetch` API).
- An OpenAI API key.
- A Tavily API key.
- A Notion internal integration and a parent page shared with that integration when running the Notion workflow.

## Installation

Clone the repository, enter its directory, and install the dependencies:

```bash
npm install
```

## Configuration

Create a local `.env` file in the repository root. Do not commit this file.

```dotenv
OPENAI_API_KEY=your-openai-api-key
TAVILY_API_KEY=your-tavily-api-key

# Required only by src/workflows/workflow.js
NOTION_API_KEY=<your-notion-integration-token>
NOTION_PAGE_ID=<your-parent-page-id>
```

The application loads environment variables through `dotenv`. The source code does not contain API keys or other credential values.

### Getting the keys

- Create an OpenAI key from the [OpenAI API platform](https://platform.openai.com/api-keys).
- Create a Tavily key from [Tavily](https://tavily.com/).
- Create a Notion integration from [Notion My integrations](https://www.notion.so/my-integrations), then share the target parent page with the integration.

## Running the examples

Start the tool-using chat agent:

```bash
node src/index.js
```

Start the research-to-Notion workflow:

```bash
node src/workflows/workflow.js
```

Both programs are interactive terminal applications. Enter `exit` to leave the current prompt loop.

## Project structure

```text
.
├── notes/                  # Learning notes for each chapter
├── src/
│   ├── index.js            # Tool-using chat agent
│   ├── tools/
│   │   └── tool.js         # Tavily search and page extraction tools
│   └── workflows/
│       └── workflow.js     # LangGraph research-to-Notion workflow
├── .env                    # Local secrets; ignored by Git
├── .gitignore
├── package.json
└── package-lock.json
```

## Security notes

- Keep all API keys, access tokens, and page identifiers in `.env` or another secret manager.
- Never paste real credentials into JavaScript files, Markdown notes, commits, or issue reports.
- `.env` and other dotenv files are ignored by `.gitignore`; verify this remains true before committing.
- If a key has been exposed, revoke it and create a replacement. Removing it from a file does not remove it from Git history or external logs.

To scan the working tree for common credential patterns on Windows PowerShell, use:

```powershell
rg -n -i "api[_-]?key|secret|token|password|authorization|bearer|sk-[A-Za-z0-9]" -g "!.env" -g "!node_modules/**"
```

Some matches are expected documentation terms or environment-variable references. Inspect each result before treating it as a leaked credential.

## Notes

The `notes/` directory is the main learning trail for this repository. It covers LangChain models, tools, agents, streaming, LangGraph state and workflows, and integrations such as Notion.

The package does not currently define an automated test script. The primary verification for these examples is running the relevant command with valid environment variables and confirming the expected model/tool or Notion response.

## License

This project currently declares the ISC license in `package.json`.