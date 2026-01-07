# n8n-nodes-justcall

[![npm version](https://img.shields.io/npm/v/n8n-nodes-justcall)](https://www.npmjs.com/package/n8n-nodes-justcall)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An n8n community node package that provides seamless integration with the JustCall API, enabling you to automate calls, SMS, contact management, and AI voice agent interactions within your n8n workflows.

## Features

This package includes two main nodes:

### 1. JustCall Node

A comprehensive node for interacting with the JustCall API, supporting the following resources:

#### 📞 **Call**
- **Get** - Retrieve a specific call by ID
- **Get Many** - List and filter calls with pagination support
- **Update** - Update call notes, disposition, and rating

#### 💬 **SMS**
- **Send** - Send SMS or MMS messages
- **Get** - Retrieve a specific SMS by ID
- **Get Many** - List and filter SMS messages

#### 👤 **Contact**
- **Create** - Create a new contact
- **Get** - Retrieve a specific contact
- **Get Many** - List and filter contacts
- **Update** - Update an existing contact

#### 📱 **Phone Number**
- **Get** - Retrieve a specific phone number
- **Get Many** - List all phone numbers

#### 🤖 **AI Voice Agent**
- **List Agents** - List all available AI voice agents
- **Initiate Call** - Initiate a call with an AI voice agent

### 2. JustCall Trigger Node

A webhook trigger node that automatically starts workflows when JustCall events occur:

- **Call Answered** - Triggered when a call is answered
- **Call Completed** - Triggered when a call is completed
- **Call Initiated** - Triggered when a call is initiated
- **Call Missed** - Triggered when a call is missed
- **Call Updated** - Triggered when a call is updated
- **Incoming Call** - Triggered when an incoming call is received
- **SMS Received** - Triggered when an SMS is received
- **SMS Sent** - Triggered when an SMS is sent
- **Voicemail Received** - Triggered when a voicemail is received

## Installation

### For n8n Cloud Users

This node is available in the n8n community nodes catalog. You can install it directly from the n8n interface:

1. Go to **Settings** → **Community Nodes**
2. Search for `n8n-nodes-justcall`
3. Click **Install**

### For Self-Hosted n8n

If you're running a self-hosted instance of n8n, install this package in your n8n installation directory:

```bash
npm install n8n-nodes-justcall
```

Or if you're using n8n via Docker, add this to your `docker-compose.yml`:

```yaml
services:
  n8n:
    environment:
      - N8N_USER_FOLDER=/home/node/.n8n
    volumes:
      - n8n_data:/home/node/.n8n
```

Then install the package in the container:

```bash
docker exec -it <container-name> npm install n8n-nodes-justcall
```

## Configuration

### API Credentials

Before using the JustCall nodes, you need to configure your JustCall API credentials:

1. In n8n, go to **Credentials** → **Add Credential**
2. Search for **JustCall API**
3. Enter your JustCall API key
   - You can find your API key in your JustCall dashboard under **Profile** → **APIs and Webhooks**

## Usage Examples

### Example 1: Send SMS on Contact Creation

Create a workflow that automatically sends a welcome SMS when a new contact is created:

1. Add a **JustCall** node
2. Select **Contact** → **Create**
3. Configure the contact details
4. Add another **JustCall** node
5. Select **SMS** → **Send**
6. Use the contact's phone number from the previous node

### Example 2: Trigger Workflow on Call Completion

Set up a workflow that processes call data when a call is completed:

1. Add a **JustCall Trigger** node
2. Select **Call Completed** event
3. Add subsequent nodes to process the call data (e.g., save to database, send notification)

### Example 3: AI Voice Agent Outbound Call

Initiate an outbound call using an AI voice agent:

1. Add a **JustCall** node
2. Select **AI Voice Agent** → **Initiate Call**
3. Select the agent and provide the phone number
4. Configure call parameters

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- TypeScript

### Setup

1. Clone the repository:
```bash
git clone https://github.com/saaslabsco/n8n-nodes-justcall.git
cd n8n-nodes-justcall
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run lint` - Run ESLint
- `npm run lintfix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run changeset` - Create a new changeset for versioning
- `npm run version` - Bump versions based on changesets
- `npm run release` - Publish the package

### Project Structure

```
n8n-nodes-justcall/
├── nodes/
│   └── JustCall/
│       ├── descriptions/     # Node property descriptions
│       ├── handlers/          # Operation handlers
│       ├── utils/             # Utility functions
│       ├── JustCall.node.ts   # Main JustCall node
│       └── JustCallTrigger.node.ts  # Trigger node
├── credentials/               # Credential definitions
└── dist/                     # Compiled output
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Create a changeset (`npm run changeset`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Versioning

This project uses [Changesets](https://github.com/changesets/changesets) for version management. When making changes:

1. Run `npm run changeset` to document your changes
2. Commit the changeset file along with your code changes
3. When ready to release, maintainers will run `npm run version` to update versions and changelog

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes and version history.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

For issues, questions, or contributions, please visit:
- **GitHub Issues**: [https://github.com/saaslabsco/n8n-nodes-justcall/issues](https://github.com/saaslabsco/n8n-nodes-justcall/issues)
- **JustCall API Documentation**: [https://developer.justcall.io/reference/initiate_outbound_call_v21](https://developer.justcall.io/reference/initiate_outbound_call_v21)

## Author

**JustCall Dev**
- Email: dev@justcall.io
- GitHub: [@saaslabsco](https://github.com/saaslabsco)

---

Made with ❤️ by the JustCall team

