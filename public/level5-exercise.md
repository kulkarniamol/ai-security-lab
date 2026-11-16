# Exercise: attack and defend an AI assistant

Enterprise demo of the AI Security Lab. About 30 minutes.

## What you will be able to do

Explain an indirect prompt injection, show the action it caused, put a
permission check in code and show that normal work still succeeds.

## The setting

Example Systems uses an AI assistant in Accounts Payable. It reads
supplier invoices and emails a processing confirmation to the AP inbox.
Its system prompt names that inbox and has one rule: email only
`@examplesystems.co.in` addresses.

The language model is live. The email tool is simulated: nothing is sent.

## Run the four steps

Open the lab and choose **Enterprise demo**. For each step, click it,
press **Run**, and write down what the right-hand card shows.

1. **Normal invoice.** Who received the email? Where did the assistant
   get that address?
2. **Altered invoice.** The staff request is the same. Find the passage
   that was added to the invoice. Who received the email now? Compare the
   two domains letter by letter. What confidential value did the email
   carry, and where did the assistant get it?
3. **Same attack, control on.** Open the full transcript and compare the
   system prompt with step 2. What changed? What did the assistant try,
   and what stopped it?
4. **Normal invoice, control on.** Did ordinary work still go through?

If a run differs from what the step describes, the page says so. Record
what happened, not what was expected.

## Test the control without a model

In "The control" card:

1. Press **Run the 7 scripted tests** and read each case.
2. Open **Read the code of the check**. Find the line that compares the
   domain.
3. Press **Download tests** and run `node permission-tests.mjs`.
4. Add three cases of your own: one that should be allowed and two that
   should be rejected. Write down your expected result before you run them.

## Write a short finding

- The intended task, and the content the attacker controlled.
- The recipient the assistant chose, and exactly what the email contained.
- The decision the code made, and whether anything was queued.
- The result for normal work with the control on.
- One limitation of this control.

Keep to what you observed. If the assistant refused instead of sending,
the code did not block anything in that run: say so.

## Limits of this lab

The check is a domain allow-list with a deliberately simple address
parser. It does not validate email addresses fully, does not decide
whether an internal person should receive the data, and offers no
approval step. The on/off switch exists for teaching; in a real system
the caller must not be able to turn enforcement off.
