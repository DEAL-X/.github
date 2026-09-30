# DEAL (Declarative and Extensible Abstract Language)
**Bridging Humans, AI, and Machines through a Common Executable Language**
```
                               AI
                             ▲    ▲
                            /      \
                           /  DEAL  \
                          ▼          ▼
                      HUMAN ◄ ── ── ► MACHINE
```
**DEAL** (Declarative and Extensible Abstract Language) is an **AI-generatable**, **human-readable**, and **machine-executable** programming language designed to provide a common communication layer between **human intent**, **artificial intelligence**, and **target programming language**.

DEAL is a **declarative**, **user-friend**, **deterministic**, **explicit**, **hybrid**, **interoperable**, **modular**, **extensible**, **abstract** and **reusable** programming language. Its fundamental grammar remains stable while domain-specific vocabulary, instructions, and localized terminology can be introduced through modules.

**The generated target programming language code will be the executable truth.**

## Main Principles
DEAL does not attempt to turn unrestricted natural language into executable programs. Instead, it defines a constrained and extensible grammatical language whose declarative instructions have deterministic JavaScript translations, while allowing ordinary JavaScript to remain embedded in the same source.
So DEAL has **five** main principles:
1. **Declarative** and **User-friendly**: Every DEAL instruction expresses computational intent in a form resembling natural language.
2. **Deterministic** and **Explicit**: Every DEAL instruction has a defined compilation into its target programming language.
3. **Hybrid** and **Interoperable**: Every DEAL instruction can coexist freely with its ordinary target programming language code.
4. **Modular** and **Extensible**: Every DEAL instruction can be extended through modules while its fundamental grammar remains stable.
5. **Abstract** and **Reusable**: Every DEAL instruction can abstract and explain target programming language code for future reuse.

## Main Syntax
In DEAL:
* All instructions are based on four fundamental concepts:
    1. **Structures** Instead of supporting all target programming language structures, the DEAL engine contains some special structures.
        * Built into the compiler.
        * They define the grammar and cannot be overridden (IF, FOR, COMMAND, USE, RESERVE, WILL, BEGIN, DOING, etc.)
    2. **Commands** All commands represent executable operations.
        * They are case-insensitive.
        * Can be overridden in code.
        * A very small set that the compiler itself needs for parsing or semantic analysis is defined as built-in.
        * They will include the following cases:
            * All simple DEAL built-in commands.
            * All third-party commands (you add them to your instructions using the USE statement).
            * All user-defined commands (defined using the COMMAND statement).
        * The user-defined command will be accessible exactly like other global commands, too.
        * They can be defined in four ways:
            * Action
            * Function
            * Definition
            * Delegation
    3. **Reserves** DEAL allows optional readability words that improve the natural flow of the language. They will affect only the parser and contain no target programming language code. These can be one of two groups below:
        * Reserved words: All words will be replaced directly in the script while being preserved in the source code.
            * The user can call any one of the codes below freely.
            * The reserved names will be completely case-insensitive.
            * It can improve the readability of the code with a predefined replacement for them.
    4. **Handlers** There are multiple defined variables accessible globally, which users can interact with.
        * A very small set of them is defined as built-in (APPLICATION, BROWSER, WINDOW, TAB, DOCUMENT, RESPONSE, ITS, ...)
        * Some of the global variables that will update based on the current status are named Handler Identifiers.
* Using predefined structures and commands, you will be able to write your procedure more clearly, more human-readable, and more flexibly.
* Case statements of DEAL are very flexible (case-relieve), instead of being somewhere:
    * Case-insensitive:
        * All target programming language ordinary structures, such as IF, FUNCTION, LET, etc.
        * All DEAL or third-party structures, such as BEGIN, USE, RESERVE, etc.
        * All DEAL or third-party commands, such as APPEND, COLLECT, POST, etc.
        * All DEAL or third-party reserveds, such as FROM, AND, WITH, etc.
        * All DEAL or third-party selectors, such as ALL, ONE, ANY, etc.
        * All DEAL or third-party handlers, such as BROWSER, WINDOW, LOAD, etc.
            * Multiple of the most important interface variables, such as DOCUMENT, CONSOLE, SCREEN, etc.
            * Multiple of the most important interface functions, such as ALERT, CONFIRM, PROMPT, etc.
    * Case-sensitive:
        * All user-defined functions/variables/constants.
        * All objects' functions/variables/constants (almost everything is written after a dot('.')).
