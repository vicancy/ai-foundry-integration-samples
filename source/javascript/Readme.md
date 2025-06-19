```bash
az login --use-device-code
node index.js
```

If `--use-device-code` is blocked by Conditional Access, try `az login`, use dev tunnel to expose the redirect localhost port to public, and manually call the redirect URL with public host name to login.