# create-kronus-stack

CLI generator for the Kronus Stack Builder.

```sh
bun create kronus-stack@latest my-app --yes --web next --ui kronus
```

The generator always writes `stack.json` and `KICKOFF.md`. The default stack
creates a runnable Next.js + Kronus UI app. Non-default framework/backend choices
are captured honestly in those artifacts and in the generated README so the next
developer or agent knows what remains to implement.
