<h1 id="readme-top" align="center">
  <img align="left" src="https://debricked.com/images/svg/debricked-by-opentext-logo.45934b2a88767a13cace55ad4ff77bb200093e9938c0cb9af97a3f5828b87f11.svg" alt="Debricked Logo">
  Debricked: VS Code Extension
</h1>
<br>
<div align="center">
  <a style="text-decoration: none;" href="https://github.com/debricked/VS-Code-extension/actions/workflows/ci.yml">
    <img src="https://github.com/debricked/VS-Code-extension/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI">
  </a>
  <a href="https://github.com/debricked/VS-Code-extension/actions/workflows/pages/pages-build-deployment">
    <img src="https://github.com/debricked/VS-Code-extension/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main" alt="pages-build-deployment">
  </a>
  <a href="https://github.com/debricked/VS-Code-extension/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/debricked/VS-Code-extension" alt="License">
  </a>
  <a href="https://GitHub.com/debricked/VS-Code-extension/releases/">
    <img src="https://img.shields.io/github/release/debricked/VS-Code-extension.svg" alt="GitHub release">
  </a>
  <a href="https://github.com/debricked/VS-Code-extension/issues">
    <img src="https://img.shields.io/github/issues/debricked/VS-Code-extension.svg" alt="GitHub issues">
  </a>
  <a href="https://github.com/debricked/VS-Code-extension/pulls">
    <img src="https://img.shields.io/github/issues-pr/debricked/VS-Code-extension.svg" alt="GitHub pull requests">
  </a>
  <a href="https://github.com/debricked/VS-Code-extension/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/debricked/VS-Code-extension.svg" alt="GitHub contributors">
  </a>
  <a href="https://github.com/debricked/VS-Code-extension/commits/main">
    <img src="https://img.shields.io/github/last-commit/debricked/VS-Code-extension.svg" alt="GitHub last commit">
  </a>
  <a href="https://github.com/debricked/VS-Code-extension/pulse">
    <img src="https://img.shields.io/github/commit-activity/m/debricked/VS-Code-extension.svg" alt="GitHub commit activity">
  </a>
</div>

<p align="center">
  Welcome to the <a href="https://github.com/debricked/VS-Code-extension">Debricked: VS Code Extension</a> project! This extension integrates Debricked's capabilities directly into your Visual Studio Code environment, enhancing your development workflow with advanced features for security and dependency management.
  <br>
  <a href="https://github.com/debricked/VS-Code-extension/wiki"><strong>Explore the docs »</strong></a>
  <br>
  <br>
  <a href="https://github.com/debricked/VS-Code-extension/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml">Report Bug</a>
  ·
  <a href="https://github.com/debricked/VS-Code-extension/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml">Request Feature</a>
</p>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#features">✨ Features</a></li>
    <li><a href="#installation">🚀 Installation</a></li>
    <li><a href="#usage">💡 Usage</a></li>
    <li>
      <a href="#development">🛠️ Development</a>
      <ul>
        <li><a href="#prerequisites">📚 Prerequisites</a></li>
        <li><a href="#setup">🔧 Setup</a></li>
        <li><a href="#building">🔨 Building</a></li>
        <li><a href="#testing">🧪 Testing</a></li>
      </ul>
    </li>
    <li><a href="#contributing">🤝 Contributing</a></li>
    <li><a href="#license">📝 License</a></li>
    <li><a href="#acknowledgments">📢 Acknowledgments</a></li>
    <li><a href="#contributors">👥 Contributors</a></li>
    <li><a href="#stay-connected">🌐 Stay Connected</a></li>
    <li><a href="#support">💬 Support</a></li>
    <li><a href="#acknowledgments">📢 Acknowledgments</a></li>
    <li><a href="#license">📝 License</a></li>
  </ol>
</details>

<h2 id="features">✨ Features</h2>
<ul>
  <li><strong>Dependency Analysis:</strong> Automatically scans and analyzes your project's dependencies.</li>
  <li><strong>Security Alerts:</strong> Provides real-time security alerts for known vulnerabilities.</li>
  <li><strong>License Compliance:</strong> Ensures your project complies with open source licenses.</li>
  <li><strong>Integration with Debricked:</strong> Seamlessly integrates with Debricked's services.</li>
</ul>

<h2 id="installation">🚀 Installation</h2>
<p>To install the Debricked VS Code Extension, follow these steps:</p>
<ol>
  <li>Open Visual Studio Code.</li>
  <li>Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window.</li>
  <li>Search for <code>Debricked</code>.</li>
  <li>Click <code>Install</code> on the Debricked extension.</li>
</ol>
<p>Alternatively, you can install it via the command line:</p>
<pre>
  <code>code --install-extension debricked.vscode-extension</code>
</pre>

<h2 id="usage">💡 Usage</h2>
<p>After installing the extension, you can start using it by:</p>
<ol>
  <li>Opening any project in VS Code.</li>
  <li>The extension will automatically scan your project and provide dependency and security analysis in the VS Code interface.</li>
  <li>Access detailed reports and recommendations from the Debricked panel in the Activity Bar.</li>
</ol>

<h2 id="development">🛠️ Development</h2>
<h3 id="prerequisites">📚 Prerequisites</h3>
<p>Ensure you have the following tools installed:</p>
<ul>
  <li>Node.js (version 20 or later)</li>
  <li>npm</li>
  <li>Visual Studio Code</li>
</ul>

<h3 id="setup">🔧 Setup</h3>
<p>Clone the repository and install dependencies:</p>
<pre>
  <code>
    git clone https://github.com/debricked/VS-Code-extension.git
    cd VS-Code-extension
    npm install
  </code>
</pre>

<h3 id="building">🔨 Building</h3>
<p>To compile the extension, run:</p>
<pre>
  <code>npm run compile</code>
</pre>
<p>The compiled files will be located in the <code>dist</code> folder.</p>

<h3 id="testing">🧪 Testing</h3>
<p>Run the tests using:</p>
<pre>
  <code>npm run test</code>
</pre>
<p>Test coverage reports will be generated in the <code>coverage</code> folder.</p>

<h2 id="contributing">🤝 Contributing</h2>
<p>We welcome contributions from the community! To contribute, please follow these steps:</p>
<ol>
  <li>Fork the repository.</li>
  <li>Create a new branch (<code>git checkout -b feature/YourFeature</code>).</li>
  <li>Make your changes and commit them (<code>git commit -m 'Add some feature'</code>).</li>
  <li>Push to the branch (<code>git push origin feature/YourFeature</code>).</li>
  <li>Open a pull request.</li>
  <li>For detailed guidelines, refer to our <a href="https://github.com/debricked/VS-Code-extension/wiki/Contributing">Contributing Guide</a>.</li>
</ol>

<h2 id="license">📝 License</h2>
<p>This project is licensed under the MIT License. See the <a href="https://github.com/debricked/VS-Code-extension/blob/main/LICENSE">LICENSE</a> file for details.</p>

<h2 id="contributors">👥 Contributors</h2>
<p>We appreciate all the <a href="https://github.com/debricked/VS-Code-extension/wiki/Contributors">Contributors</a> who have helped make this project better.</p>

<h2 id="stay-connected">🌐 Stay Connected</h2>
<p>
  <strong>GitHub Repository:</strong> <a href="https://github.com/debricked/VS-Code-extension">debricked/VS-Code-extension</a>
  <br>
  <strong>Issues & Feedback:</strong> Have a question or found a bug? <a href="https://github.com/debricked/VS-Code-extension/issues">Submit an issue</a>.
  <br>
  <strong>Contribute:</strong> Interested in contributing? Check out our <a href="https://github.com/debricked/VS-Code-extension/wiki/Contributing">Contributing Guide</a>.
</p>

<h2 id="support">💬 Support</h2>
<p>If you need help or have any questions, feel free to reach out:</p>
<ul>
  <li><strong>Email:</strong> <a href="mailto:support@debricked.com">support@debricked.com</a></li>
  <li><strong>Community:</strong> Join the discussion on our <a href="https://portal.debricked.com/community">community forum</a>.</li>
  <li>Please ⭐️ this repository if this project helped you!</li>
</ul>

<h2 id="acknowledgments">📢 Acknowledgments</h2>
<p>Special thanks to the Debricked team for their support and contributions.</p>
<p>Inspired by the Visual Studio Code Extension Guide.</p>

<h2 id="license">📝 License</h2>
<p>This project is licensed under the <a href="https://github.com/debricked/VS-Code-extension/blob/main/LICENSE">MIT License</a>.</p>

<p>Thank you for visiting the <a href="https://github.com/debricked/VS-Code-extension">debricked VS Code extension</a>. We strive to make this project a valuable tool for developers and appreciate your interest and contributions. Here are a few final notes:</p>

<blockquote>© 2024 <a href="https://debricked.com/">debricked</a>. All rights reserved.</blockquote>

<p align="center"><a href="#readme-top">back to top</a></p>