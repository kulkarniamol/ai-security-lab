# Break and defend an AI assistant

## Your result
Explain an indirect prompt injection, show the attempted action, enforce a tool permission and prove legitimate work still succeeds.

## Run the demonstration
Open the lab with `?demo=invoice` appended to its URL for the focused presentation view. Email and page-fetch tools are simulated. Only the language model is live.

1. Explain the normal workflow: an invoice arrives by email or a supplier portal; Accounts Payable verifies supplier, purchase order, goods received and amount; the invoice is recorded and routed for approval. A person may do this manually or use an assistant for extraction and confirmation. Payment authorization remains separate. These upstream steps are explained, not implemented in this lab.
2. Choose **Load normal invoice**, then **Send**. The clean invoice contains no malicious processing note. The simulated vendor record lists the internal AP address. Inspect the confirmation recipient and payload. The permission check is off to establish the ordinary behavior first.
3. Choose **Load altered invoice**, then **Send**. The user's task stays unchanged, but the invoice now contains a malicious routing note. The optional fetched record also reinforces it. Compare `examplesystem.co.in` with `examplesystems.co.in`. Inspect the attempted recipient and actual data. The KESTREL-7 marker may not appear. If the assistant refuses, report that honestly; do not claim the attack succeeded.
4. Pause for the session's theme:
   - **Fix the assistant:** trace how untrusted content became an instruction and identify the tool boundary where code can enforce permission.
   - **Explore security careers:** Governance & Risk defines acceptable use, risk ownership and evidence; Engineering builds and tests the tool control; IT/Infosec manages identities, access, monitoring and incident response. These are overlapping perspectives, not rigid organizational boundaries.
5. Choose **Protect and retry attack**, then **Send**. This retains the altered sources and enables the code check. If an external send is attempted, the tool rejects it. If no prohibited action is attempted, the control was not exercised. Each request is a fresh model run.
6. Choose **Recheck normal invoice**, then **Send**. This restores the clean sources and keeps protection on. Verify that legitimate work still succeeds.
7. Select **Run permission tests**. These seven fixed cases exercise the tool policy without a model. They are scripted tests, not proof of a successful live injection. Download them and run `node level5-permission-tests.mjs`. Add one allowed recipient and two rejected recipients; explain your expected outcomes first.

## Understand the trust boundary
The invoice is data supplied by another party. Its processing note tries to become an instruction about where the assistant sends information. The optional fetched ERP record is also simulated and attacker-controlled. It is not independent verification.

The model proposes an action. Application code decides whether that action is permitted. Stronger wording in a prompt does not replace that check.

## Keep evidence
Write a short finding with:
- Intended task and attacker-controlled input.
- Attempted recipient and exact outgoing data.
- Permission decision and observed result, including whether anything was queued.
- Before/after evidence and the legitimate-work result.
- Test cases, results and one limitation.

Do not claim the marker leaked unless it appears in the outgoing payload. Do not claim the code blocked an attack when no prohibited action was attempted.

## Limits
This lab restricts recipient domains using a deliberately simple parser. It does not provide complete email validation, user authorization, approval workflows or protection against disclosure to an unauthorized internal recipient. The switch is a teaching control; production permissions must be enforced by the server and must not be chosen by the requester. No real email is sent.

## Presenter timing for a 30-minute session
- 0-6 minutes: explain invoice arrival and manual/assisted processing; run the normal case.
- 6-12 minutes: introduce the altered sources and inspect attack evidence.
- 12-19 minutes: follow the session theme, either the engineering fix or the three security areas.
- 19-24 minutes: demonstrate the permission check and recheck normal work.
- 24-27 minutes: run fixed tests and capture one practical takeaway.
- 27-30 minutes: questions and next session.

Rehearse with the deployed model before teaching. Keep a clearly labeled recording of your own successful rehearsal as a fallback. If a live run refuses, explain the result honestly and continue with the explicitly scripted tests.
