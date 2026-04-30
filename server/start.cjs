// CJS entry point that loads the ESM server
async function main() {
  await import('./index.js');
}
main().catch(err => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
