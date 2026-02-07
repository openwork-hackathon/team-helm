const fs = require('fs');
const path = require('path');
const solc = require('solc');

function compile(contractName) {
  const contractPath = path.resolve(__dirname, '../contracts', `${contractName}.sol`);
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      [`${contractName}.sol`]: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  // Note: We need OpenZeppelin imports.
  // We can either map them or install them and use a callback.
  // For simplicity, I'll assume they are in node_modules and setup a finder.
  function findImports(importPath) {
    try {
      const fullPath = path.resolve(__dirname, '../node_modules', importPath);
      if (fs.existsSync(fullPath)) {
        return { contents: fs.readFileSync(fullPath, 'utf8') };
      }
    } catch (e) {}
    return { error: 'File not found' };
  }

  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  if (output.errors) {
    output.errors.forEach((err) => {
      console.error(err.formattedMessage);
    });
    // Don't exit if just warnings
    if (output.errors.some(e => e.severity === 'error')) process.exit(1);
  }

  const contract = output.contracts[`${contractName}.sol`][contractName];
  
  fs.writeFileSync(
    path.resolve(__dirname, `../contracts/${contractName}.json`),
    JSON.stringify(contract, null, 2)
  );
  
  console.log(`✅ Compiled ${contractName}`);
}

compile('HELMStaking');
