# create-cronus-stack

CLI generator for the Cronus Stack Builder.

```sh
bun create cronus-stack@latest my-app --yes --web next --ui cronus
```

The generator always writes `stack.json` and `KICKOFF.md`. The default stack
creates a runnable Next.js + Cronus UI app. Non-default framework/backend choices
are captured honestly in those artifacts and in the generated README so the next
developer or agent knows what remains to implement.
