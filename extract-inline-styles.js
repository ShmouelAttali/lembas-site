// File: extract-inline-styles.js
// Description: Automatically extracts inline style objects from TSX/JSX into CSS Modules

const { Project, Node } = require("ts-morph");
const fs = require("fs");
const path = require("path");

// Initialize project from your tsconfig.json
const project = new Project({
    tsConfigFilePath: "tsconfig.json"
});

// Process all TSX/JSX files under src/
project.getSourceFiles("src/**/*.{tsx,jsx}").forEach(sourceFile => {
    const filePath = sourceFile.getFilePath();
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    const moduleName = `${baseName}.module.css`;
    let hasStyles = false;
    let moduleContent = "";

    // Visit all JSX attributes named 'style'
    sourceFile.forEachDescendant(node => {
        if (Node.isJsxAttribute(node)) {
            const nameNode = node.getNameNode();
            const attrName = nameNode.getText();
            if (attrName === "style") {
                const initializer = node.getInitializer();
                if (initializer && Node.isJsxExpression(initializer)) {
                    const expr = initializer.getExpression();
                    if (expr && Node.isObjectLiteralExpression(expr)) {
                        hasStyles = true;
                        // Generate a unique class name based on the component name and line number
                        const line = node.getStartLineNumber();
                        const className = `${baseName}_${line}`;
                        let classBody = "";

                        // Extract style properties
                        expr.getProperties().forEach(prop => {
                            if (Node.isPropertyAssignment(prop)) {
                                const key = prop.getNameNode().getText();
                                const init = prop.getInitializer();
                                if (init) {
                                    // Convert camelCase to kebab-case
                                    const cssProp = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                                    const value = init.getText().replace(/['"`]/g, "");
                                    classBody += `  ${cssProp}: ${value};\n`;
                                }
                            }
                        });

                        // Append class definition to CSS module content
                        moduleContent += `.${className} {\n${classBody}}\n\n`;

                        // Replace inline style with className reference
                        node.replaceWithText(`className={styles.${className}}`);
                    }
                }
            }
        }
    });

    // If we extracted any styles, write CSS module and save TSX
    if (hasStyles) {
        // Add import for CSS module if missing
        if (!sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === `./${moduleName}`)) {
            sourceFile.addImportDeclaration({
                defaultImport: "styles",
                moduleSpecifier: `./${moduleName}`
            });
        }
        // Write the CSS module file
        fs.writeFileSync(path.join(dir, moduleName), moduleContent, "utf8");
        // Save the updated component file
        sourceFile.saveSync();
        console.log(`Refactored ${filePath}`);
    }
});

console.log("Inline style extraction complete.");

