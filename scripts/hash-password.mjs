// Makes an ADMIN_USERS entry:  npm run admin:hash -- <username>
// Asks for the password without echoing it, then prints  username:$2b$12$...  to add to
// ADMIN_USERS (comma-separate several admins). The password itself is never stored.
import bcrypt from "bcryptjs";
import readline from "node:readline";

const username = (process.argv[2] || "").trim().toLowerCase();
if (!/^[a-z0-9._-]{2,40}$/.test(username)) {
  console.error("Usage: npm run admin:hash -- <username>   (letters, numbers, . _ -)");
  process.exit(1);
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : "");
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = process.env.ADMIN_PASSWORD || (await ask(`Password for ${username}: `));
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
if (!process.env.ADMIN_PASSWORD && (await ask("Again: ")) !== password) {
  console.error("The passwords didn't match.");
  process.exit(1);
}
console.log(`\n${username}:${await bcrypt.hash(password, 12)}\n`);
console.log("Add that to ADMIN_USERS (in .env locally, or Vercel → Settings → Environment Variables).");
