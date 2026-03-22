import React from 'react';

// --- UI Components for Blog Feel ---

const CodeBlock = ({ code, language = 'javascript' }: { code: string, language?: string }) => (
    <div className="my-8 rounded-xl overflow-hidden shadow-md border border-gray-200">
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs font-mono text-gray-500 uppercase">{language}</span>
        </div>
        <pre className="bg-gray-50 text-gray-800 p-6 overflow-x-auto text-sm font-mono leading-relaxed border-l-4 border-[#FF6643]">
            <code>{code}</code>
        </pre>
    </div>
);

const MainHeading = ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-12 mb-6 tracking-tight">{children}</h1>
);

const SectionHeading = ({ children, id }: { children: React.ReactNode, id?: string }) => (
    <h2 id={id} className="text-2xl font-bold text-gray-800 mt-12 mb-6 pb-2 border-b-2 border-orange-100 flex items-center gap-3">
        <span className="text-[#FF6643] text-3xl leading-none">•</span>
        {children}
    </h2>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">{children}</h3>
);

const Text = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-6 text-gray-700 leading-normal text-base text-justify">{children}</p>
);

const List = ({ items, ordered = false }: { items: React.ReactNode[], ordered?: boolean }) => {
    const Tag = ordered ? 'ol' : 'ul';
    const listClass = ordered ? 'list-decimal' : 'list-disc';
    return (
        <Tag className={`${listClass} pl-8 mb-6 text-gray-700 leading-normal text-base space-y-2`}>
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </Tag>
    );
};

const ImportantNote = ({ children, title = "Note" }: { children: React.ReactNode, title?: string }) => (
    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl my-8 text-green-900 shadow-sm">
        <strong className="font-bold flex items-center gap-2 mb-2 text-green-700 text-base">📝 {title}</strong>
        <p className="text-sm leading-relaxed m-0">{children}</p>
    </div>
);

const WarningAlign = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl my-8 text-red-900 shadow-sm">
        <strong className="font-bold flex items-center gap-2 mb-2 text-red-700 text-base">⚠️ Warning</strong>
        <p className="text-sm leading-relaxed m-0">{children}</p>
    </div>
);


const TableOfContents = ({ links }: { links: { title: string, id: string }[] }) => (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 my-8 float-none lg:float-right lg:ml-8 lg:mb-8 lg:w-80 clear-both">
        <h4 className="font-bold text-lg mb-4 text-gray-800 uppercase tracking-wider">Table of Contents</h4>
        <ul className="space-y-3">
            {links.map(link => (
                <li key={link.id}>
                    <a href={`#${link.id}`} className="text-[#FF6643] hover:underline flex items-center gap-2">
                        <span className="text-orange-300">▹</span> {link.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);


// --- Mapping Detailed Content ---

const contentMap: Record<number, React.ReactNode> = {
    // 1: HTML Basics
    1: (
        <div className="max-w-none">
            <TableOfContents links={[
                { title: "Introduction to HTML", id: "intro" },
                { title: "Basic Structure of an HTML Document", id: "structure" },
                { title: "HTML Elements and Tags", id: "elements" },
                { title: "HTML Attributes", id: "attributes" },
                { title: "Semantic HTML", id: "semantic" },
                { title: "Forms and Inputs", id: "forms" },
                { title: "Summary", id: "summary" }
            ]} />

            <SectionHeading id="intro">Introduction to HTML</SectionHeading>
            <Text>
                HTML stands for <strong>HyperText Markup Language</strong>. It is the standard markup language for creating Web pages. HTML describes the structure of a Web page semantically and originally included cues for the appearance of the document. HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page.
            </Text>
            <Text>
                It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
            </Text>

            <SectionHeading id="structure">Basic Structure of an HTML Document</SectionHeading>
            <Text>
                Every HTML document follows a specific structure. The structure ensures that the web browser understands how to render the content. An HTML document is broadly divided into two parts: the <code>&lt;head&gt;</code> and the <code>&lt;body&gt;</code>.
            </Text>
            <CodeBlock language="html" code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Comprehensive HTML Page</title>
</head>
<body>
    <h1>Welcome to GeeksforGeeks Style Learning</h1>
    <p>This is where all the visible content goes.</p>
</body>
</html>`} />
            <ImportantNote title="The DOCTYPE Declaration">
                The <code>&lt;!DOCTYPE html&gt;</code> declaration represents the document type, and helps browsers to display web pages correctly. It must only appear once, at the top of the page (before any HTML tags). It is not case sensitive.
            </ImportantNote>

            <SectionHeading id="elements">HTML Elements and Tags</SectionHeading>
            <Text>
                An HTML element usually consists of a start tag and an end tag, with the content inserted in between:
                <br /><code className="bg-gray-100 p-1 rounded text-orange-600">&lt;tagname&gt; Content goes here... &lt;/tagname&gt;</code>
            </Text>
            <SubHeading>Commonly Used Elements</SubHeading>
            <List items={[
                <span><strong>Headings:</strong> Defined with the <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> tags. <code>&lt;h1&gt;</code> defines the most important heading.</span>,
                <span><strong>Paragraphs:</strong> Defined with the <code>&lt;p&gt;</code> tag.</span>,
                <span><strong>Links:</strong> Defined with the <code>&lt;a&gt;</code> tag. The link's destination is specified in the <code>href</code> attribute.</span>,
                <span><strong>Images:</strong> Defined with the <code>&lt;img&gt;</code> tag. The source file (<code>src</code>), alternative text (<code>alt</code>), width, and height are provided as attributes.</span>
            ]} />

            <CodeBlock language="html" code={`<!-- Example of Headings and Paragraphs -->
<h2>This is a Heading 2</h2>
<p>This is a paragraph explaining the heading. Paragraphs automatically add empty space above and below the text.</p>

<!-- Example of an Anchor (Link) -->
<a href="https://www.example.com" target="_blank">Visit Example.com</a>

<!-- Example of an Image -->
<img src="mountain.jpg" alt="A beautiful mountain landscape" width="500" height="300">`} />

            <SectionHeading id="attributes">HTML Attributes</SectionHeading>
            <Text>
                Attributes provide additional information about HTML elements. All HTML elements can have attributes. They are always specified in the start tag and usually come in name/value pairs like: <code>name="value"</code>.
            </Text>
            <List items={[
                <span>The <strong>href</strong> attribute of <code>&lt;a&gt;</code> specifies the URL of the page the link goes to.</span>,
                <span>The <strong>src</strong> attribute of <code>&lt;img&gt;</code> specifies the path to the image to be displayed.</span>,
                <span>The <strong>style</strong> attribute is used to add styles to an element, such as color, font, size, and more.</span>,
                <span>The <strong>title</strong> attribute provides extra information about an element (displayed as a tooltip when hovering).</span>
            ]} />

            <SectionHeading id="semantic">Semantic HTML</SectionHeading>
            <Text>
                Semantic HTML implies the use of HTML markup to reinforce the semantics, or meaning, of the information in webpages and web applications rather than merely to define its presentation or look. Semantic HTML is processed by regular web browsers as well as by many other user agents.
            </Text>
            <Text>
                Examples of semantic elements: <code>&lt;form&gt;</code>, <code>&lt;table&gt;</code>, and <code>&lt;article&gt;</code> - Clearly defines its content. Examples of non-semantic elements: <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> - Tells nothing about its content.
            </Text>
            <CodeBlock language="html" code={`<header>
    <h1>My Website</h1>
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h2>Blog Post Title</h2>
        <p>This is the content of the blog post...</p>
    </article>
</main>

<footer>
    <p>&copy; 2026 My Website</p>
</footer>`} />

            <SectionHeading id="forms">Forms and Inputs</SectionHeading>
            <Text>
                HTML Forms are required when you want to collect data from the site visitor. For example, during user registration you would like to collect information such as name, email address, credit card, etc.
            </Text>
            <CodeBlock language="html" code={`<form action="/submit_data" method="post">
    <label for="fname">First name:</label><br>
    <input type="text" id="fname" name="fname" value="John"><br>
    
    <label for="lname">Last name:</label><br>
    <input type="text" id="lname" name="lname" value="Doe"><br><br>
    
    <input type="submit" value="Submit">
</form>`} />

            <SectionHeading id="summary">Summary</SectionHeading>
            <Text>
                In this module, we covered the absolute foundations of the web. HTML is not a programming language but a markup language that structures content. By mastering tags, attributes, and semantic layout, you lay the critical groundwork for the CSS and JavaScript modules that follow.
            </Text>
        </div>
    ),

    // 2: CSS Basics
    2: (
        <div className="max-w-none">
            <TableOfContents links={[
                { title: "Introduction to CSS", id: "intro-css" },
                { title: "CSS Syntax and Selectors", id: "syntax" },
                { title: "Ways to Insert CSS", id: "insert" },
                { title: "The Box Model", id: "box-model" },
                { title: "Flexbox Layout", id: "flexbox" },
                { title: "Summary", id: "summary-css" }
            ]} />

            <SectionHeading id="intro-css">Introduction to CSS</SectionHeading>
            <Text>
                CSS stands for <strong>Cascading Style Sheets</strong>. CSS describes how HTML elements are to be displayed on screen, paper, or in other media. It saves a lot of work. It can control the layout of multiple web pages all at once. External stylesheets are stored in CSS files.
            </Text>

            <SectionHeading id="syntax">CSS Syntax and Selectors</SectionHeading>
            <Text>
                A CSS rule-set consists of a selector and a declaration block. The selector points to the HTML element you want to style. The declaration block contains one or more declarations separated by semicolons. Each declaration includes a CSS property name and a value, separated by a colon.
            </Text>
            <CodeBlock language="css" code={`/* Selector: h1 */
h1 {
  /* Declaration */
  color: blue;
  
  /* Declaration */
  font-size: 12px;
}

/* Class Selector */
.highlight-text {
  background-color: yellow;
  font-weight: bold;
}

/* ID Selector */
#main-header {
  border-bottom: 2px solid black;
}`} />

            <SectionHeading id="box-model">The Box Model</SectionHeading>
            <Text>
                All HTML elements can be considered as boxes. In CSS, the term "box model" is used when talking about design and layout. The CSS box model is essentially a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.
            </Text>
            <List items={[
                <span><strong>Content</strong> - The content of the box, where text and images appear</span>,
                <span><strong>Padding</strong> - Clears an area around the content. The padding is transparent</span>,
                <span><strong>Border</strong> - A border that goes around the padding and content</span>,
                <span><strong>Margin</strong> - Clears an area outside the border. The margin is transparent</span>
            ]} />
            <CodeBlock language="css" code={`div.box {
  width: 300px;
  border: 15px solid green;
  padding: 50px;
  margin: 20px;
}`} />
            <ImportantNote title="Box-Sizing">
                By default, the width and height of an element is calculated like this: <br />
                <code>width + padding + border = actual visible/rendered width of an element</code>. <br />
                We highly recommend using <code>box-sizing: border-box;</code> on all elements to make width calculations easier!
            </ImportantNote>

            <SectionHeading id="summary-css">Summary</SectionHeading>
            <Text>
                CSS brings life to the dull structure of HTML. Mastering the Box Model, understanding Selectors, and getting comfortable with layouts like Flexbox are essential skills for any frontend developer.
            </Text>
        </div>
    ),

    // 3: JavaScript Fundamentals
    3: (
        <div className="max-w-none">
            <TableOfContents links={[
                { title: "What is JavaScript?", id: "what-is-js" },
                { title: "Variables (Let, Const, Var)", id: "variables" },
                { title: "Data Types", id: "datatypes" },
                { title: "Functions", id: "functions" },
                { title: "Control Flow", id: "control-flow" },
                { title: "Objects & Arrays", id: "objects" }
            ]} />

            <SectionHeading id="what-is-js">What is JavaScript?</SectionHeading>
            <Text>
                JavaScript (often shortened to JS) is a lightweight, interpreted, object-oriented language with first-class functions, and is best known as the scripting language for Web pages. While HTML defines the structure and CSS defines the appearance, JavaScript defines the behavior of a web page.
            </Text>

            <SectionHeading id="variables">Variables (Let, Const, Var)</SectionHeading>
            <Text>
                Before ES6, JavaScript only had one way to declare variables: <code>var</code>. Today, modern JavaScript uses <code>let</code> and <code>const</code>.
            </Text>
            <List items={[
                <span><strong>const</strong>: Used for variables that should never change their value (immutable reference).</span>,
                <span><strong>let</strong>: Used for variables whose values will change over time (e.g., counters in a loop).</span>,
                <span><strong>var</strong>: The old way. It is function-scoped rather than block-scoped. Best to avoid today.</span>
            ]} />
            <CodeBlock language="javascript" code={`const PI = 3.14159;
// PI = 3; // This will throw a TypeError

let score = 0;
score = score + 10; // This is perfectly fine

function exampleScope() {
    if (true) {
        let blockScoped = "I only exist in this if block";
        var functionScoped = "I exist anywhere in the function";
    }
    // console.log(blockScoped); // ReferenceError
    console.log(functionScoped); // Logs string
}`} />

            <SectionHeading id="functions">Functions</SectionHeading>
            <Text>
                Functions are one of the fundamental building blocks in JavaScript. A function in JavaScript is similar to a procedure—a set of statements that performs a task or calculates a value, but for a procedure to qualify as a function, it should take some input and return an output where there is some obvious relationship between the input and the output.
            </Text>
            <CodeBlock language="javascript" code={`// Traditional Function Declaration
function calculateArea(width, height) {
  return width * height;
}

// Arrow Function (ES6+)
const calculateVolume = (length, width, height) => {
  return length * width * height;
};

// Arrow function with implicit return
const square = (n) => n * n;`} />

            <SectionHeading id="objects">Objects & Arrays</SectionHeading>
            <Text>
                JavaScript is heavily object-oriented. Objects are collections of key-value pairs. Arrays are special objects used to store ordered collections of data.
            </Text>
            <CodeBlock language="javascript" code={`// An Object
const userProfile = {
    username: "coder123",
    email: "coder@example.com",
    isAdmin: false,
    login: function() {
        console.log(this.username + " has logged in.");
    }
};

userProfile.login(); // Accessing object methods

// An Array
const favoriteLanguages = ["JavaScript", "Python", "Rust", "Go"];

// Array methods
favoriteLanguages.push("TypeScript");
const jsIndex = favoriteLanguages.indexOf("JavaScript");

// Higher-order array methods (very common in React)
const upperLanguages = favoriteLanguages.map(lang => lang.toUpperCase());
const pLanguages = favoriteLanguages.filter(lang => lang.startsWith('P'));`} />

            <WarningAlign>
                Array indices in JavaScript always start at 0, not 1! `favoriteLanguages[0]` will return "JavaScript".
            </WarningAlign>
        </div>
    )
};

// Fallback generator for unmapped modules
const generateFallbackContent = (moduleTitle: string) => (
    <div className="max-w-none">
        <SectionHeading id="intro">Comprehensive Guide to {moduleTitle}</SectionHeading>
        <Text>
            Welcome to the definitive guide on <strong>{moduleTitle}</strong>. In modern software engineering, deeply understanding this topic is absolutely critical to architecting scalable, maintainable, and high-performance applications.
        </Text>
        <Text>
            This module is structured to take you from the fundamental core concepts all the way to advanced implementation patterns. We will explore the theoretical background, the underlying mechanics, and dive into extensive practical code examples.
        </Text>

        <SectionHeading id="core-concepts">Core Concepts & Architecture</SectionHeading>
        <Text>
            Before writing a single line of code, it is vital to understand the "Why" and "How" of {moduleTitle}. Most bugs in complex systems stem from a misunderstanding of the foundational architecture rather than syntax errors.
        </Text>
        <List items={[
            <span><strong>Design Philosophy:</strong> Why was this technology created? What specific problem does it solve better than its alternatives?</span>,
            <span><strong>Lifecycle & Execution:</strong> Understanding how the environment processes, compiles, and executes the code.</span>,
            <span><strong>Memory Management:</strong> How resources are allocated and garbage collected.</span>
        ]} />

        <SectionHeading id="implementation">Practical Implementation</SectionHeading>
        <Text>
            Let's transition from theory to practice. Below is a foundational implementation pattern that represents industry best practices.
        </Text>
        <CodeBlock code={`/**
 * Enterprise-grade implementation pattern for ${moduleTitle}
 * This demonstrates separation of concerns, error handling,
 * and scalable architecture.
 */
 
class ${moduleTitle.replace(/\s+/g, '')}Manager {
    constructor(configuration) {
        this.config = configuration;
        this.state = 'INITIALIZED';
        this.cache = new Map();
    }

    /**
     * Executes the primary business logic flow
     * @param {Object} payload - The execution parameters
     * @returns {Promise<Object>} The computed result
     */
    async executeProcess(payload) {
        try {
            console.log(\`[\${new Date().toISOString()}] Starting executeProcess...\`);
            
            // Step 1: Validation
            if (!payload || !payload.id) {
                throw new Error("Invalid payload provided");
            }
            
            // Step 2: Cache Check
            if (this.cache.has(payload.id)) {
                return this.cache.get(payload.id);
            }
            
            // Step 3: Complex Processing (Simulated)
            const result = await this.performHeavyComputation(payload);
            
            // Step 4: Caching and Return
            this.cache.set(payload.id, result);
            return result;
            
        } catch (error) {
            console.error("Execution failed:", error.message);
            // Implement fallback mechanism or re-throw
            throw error;
        }
    }
    
    async performHeavyComputation(data) {
        // Simulating async logic
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, processedData: data, timestamp: Date.now() });
            }, 1000);
        });
    }
}

// Initialization and Invocation
const instance = new ${moduleTitle.replace(/\s+/g, '')}Manager({ mode: 'production' });
instance.executeProcess({ id: 9942, metadata: 'example' })
    .then(res => console.log("Final Result:", res))
    .catch(err => console.error("Final Error:", err));`} />

        <ImportantNote title="Scalability Check">
            Notice how the implementation above utilizes caching (<code>Map</code>) and robust Try/Catch blocks. When dealing with {moduleTitle} in a production environment handling thousands of concurrent requests, these micro-optimizations prevent server bottlenecks!
        </ImportantNote>

        <SectionHeading id="advanced">Advanced Techniques</SectionHeading>
        <Text>
            Once you have mastered the basics, you are ready to explore the nuances. Topics such as concurrency models, multithreading (where applicable), memory leak profiling, and sub-millisecond optimizations become your day-to-day focuses.
        </Text>
        <Text>
            We highly recommend reviewing the official documentation and engaging with the open-source community to stay updated on the latest patterns. The technology landscape evolves rapidly, and maintaining an adaptable skillset is your greatest asset.
        </Text>

        <SectionHeading id="summary">Conclusion</SectionHeading>
        <Text>
            You have successfully completed the extensive guide on {moduleTitle}. You should now possess a commanding understanding of its architecture, syntax, and best practices for enterprise deployment. Proceed to the associated quiz to validate your knowledge.
        </Text>
    </div>
);

export const getStaticModuleContent = (moduleId: number, moduleTitle: string): React.ReactNode => {
    if (contentMap[moduleId]) {
        return contentMap[moduleId];
    }
    return generateFallbackContent(moduleTitle);
};
