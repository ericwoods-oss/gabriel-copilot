/**
 * Gabriel — Carrier Knowledge Base
 * Texas Personal Auto Insurance — Underwriting & Compliance Reference
 *
 * This structured knowledge base is injected into Gabriel's AI system prompt.
 * Keep it factual, Texas-specific, and grounded in real underwriting rules.
 */

export const CARRIER_KNOWLEDGE = `
# GABRIEL'S TEXAS INSURANCE KNOWLEDGE BASE
# Texas Personal Auto — Underwriting, Compliance & Agent Reference

---

## TEXAS STATE REQUIREMENTS — PERSONAL AUTO

### Minimum Liability Limits (TX Transportation Code §601.072)
- Bodily Injury: $30,000 per person / $60,000 per occurrence
- Property Damage: $25,000 per occurrence
- Often written as "30/60/25"
- Agents MUST inform customer of state minimums when they select liability-only coverage

### UM/UIM (Uninsured/Underinsured Motorist) — REQUIRED OFFER
- Texas requires agents to OFFER UM/UIM coverage in writing
- Customer may reject in writing — rejection form required (TX Ins. Code §1952.101)
- UM/UIM protects the insured when the at-fault driver has no insurance or insufficient limits
- About 1 in 7 Texas drivers is uninsured — always recommend UM/UIM

### PIP (Personal Injury Protection) — REQUIRED OFFER
- Minimum PIP offer: $2,500 (TX Ins. Code §1952.152)
- Pays medical/lost wages regardless of fault
- Customer may reject in writing — rejection form required
- PIP cannot be waived verbally — a signed rejection is mandatory

### SR-22 Filing
- Required after: DUI/DWI conviction, driving without insurance, certain serious violations
- Duration: 2 years from license reinstatement date
- Agent contacts carrier; carrier files form SR-22 directly with TxDMV
- If policy lapses during SR-22 period, carrier MUST notify TxDMV — license is suspended
- Non-owner SR-22 available for drivers without a vehicle

---

## UNDERWRITING ELIGIBILITY RULES (General Guidelines)

### Driving Record — Points / Violations
- 0-1 minor violations (last 3 years): Standard rates
- 2-3 minor violations: Surcharge tier / non-standard market
- 1 major violation (DUI, reckless, hit & run): Non-standard or specialty carrier
- 2+ major violations: Likely declined standard; refer to non-standard / assigned risk
- At-fault accidents count as points; not-at-fault accidents generally do not affect eligibility
- Violations older than 3 years typically not rated (varies by carrier)

### DUI / DWI
- Single DUI: Most standard carriers decline; route to non-standard (e.g., Progressive, The General, Bristol West)
- DUI within last 5 years: Always disclose; customers must verify SR-22 status
- Deferred adjudication on DUI: Some carriers still treat as conviction — verify carrier rules
- Non-owner policy available if customer has DUI but no vehicle

### Lapse in Coverage
- 0-29 day lapse: Usually acceptable at standard rates
- 30-89 day lapse: Surcharge likely; some carriers add surcharge tier
- 90+ day lapse: Non-standard market; customer must explain gap
- No prior insurance (new driver or new to U.S.): Non-standard market, higher base rates

### Young / Youthful Drivers
- Under 25 with less than 3 years licensed: Youthful driver rating — significant surcharge
- Teen drivers (under 18): Must be listed; cannot be excluded in most cases
- Good student discount: Typically 3.0+ GPA; proof required (transcript or report card)
- Driver training discount: Completion of approved course — ask customer

### Excluded Drivers
- Agent may exclude a household member driver to reduce premium
- TX exclusion form required — signed by named insured
- Excluded driver has ZERO coverage if they drive the vehicle — must communicate clearly
- Some carriers will not insure a vehicle if all household drivers are excluded

### VIN Verification
- VIN is 17 characters (mix of letters and numbers — no I, O, or Q)
- Pattern: positions 1-3 = manufacturer, 4-8 = vehicle descriptor, 9 = check digit, 10 = model year, 11 = plant, 12-17 = serial
- Common model year codes: 2020=L, 2021=M, 2022=N, 2023=P, 2024=R, 2025=S, 2026=T
- Always verify VIN against vehicle title or physical VIN plate

---

## COVERAGE OPTIONS — WHAT AGENTS NEED TO KNOW

### Comprehensive vs. Collision
- Comprehensive: Non-collision damage (theft, hail, flood, fire, glass, animal strike)
- Collision: Damage from collision with another vehicle or object
- If vehicle loan/lease exists, lender typically requires both comp and collision
- Deductibles: Common choices are $250, $500, $1,000 — higher deductible = lower premium

### Rental Reimbursement
- Pays for rental car while insured vehicle is being repaired after a covered loss
- Common limits: $30/day up to $900 or $40/day up to $1,200
- Does NOT cover rentals for mechanical breakdown

### Roadside Assistance / Towing
- Covers towing, flat tire, lockout, jump start, fuel delivery
- Usually inexpensive rider — ask every customer

### Gap Insurance
- If vehicle is financed, gap covers the difference between ACV and loan balance after total loss
- Especially valuable for new vehicles where depreciation is steep
- Worth asking: "How much do you owe on the vehicle?"

---

## COMMON "WHAT IF" SCENARIOS

**Q: What if the customer has a DUI from 2 years ago?**
A: Route to non-standard market (Progressive, The General, Bristol West, Gainsco). SR-22 is likely still required — verify with customer. Standard carriers will decline. Always disclose the DUI on the application.

**Q: What if the customer just moved to Texas from another state?**
A: Prior out-of-state coverage counts for continuity — get the prior carrier name and policy number. TX minimums apply immediately. Customer has 90 days to register vehicle and get TX plates after establishing residency.

**Q: What if the customer has no prior insurance?**
A: Non-standard market. Explain that rates are higher due to no prior proof of continuous coverage. Recommend starting coverage ASAP to build insurance history. After 6-12 months of clean record, re-shop standard market.

**Q: What if one driver in the household has multiple accidents?**
A: Explore driver exclusion if the problematic driver is not the primary vehicle user. Explain exclusion clearly — excluded driver has zero coverage. If exclusion isn't possible, non-standard market for whole policy.

**Q: What if the customer's vehicle is a salvage title?**
A: Most standard carriers will not write comprehensive/collision on a salvage title. Liability-only is usually available. A few specialty carriers (Hagerty, some non-standard) may write physical damage on salvage — verify carrier appetite.

**Q: What if the customer needs SR-22 but doesn't own a vehicle?**
A: Non-owner SR-22 policy. Liability-only. Covers the customer when driving any non-owned vehicle. Agent initiates the SR-22 filing. Customer must maintain it for the required period (usually 2 years).

**Q: What if the customer is an international driver / non-US license?**
A: Most carriers accept foreign licenses. International Driving Permit (IDP) is not required to get insurance in TX. Customer should work toward getting TX license. Some carriers have restrictions on licenses from certain countries — verify.

**Q: What if the customer says someone else will be the primary driver?**
A: Household members must be listed. If a non-household member will be the primary driver, the policy may need to be in that person's name (vehicle should be insured by the primary driver). Misrepresentation at application is grounds for claim denial.

**Q: What if the customer asks about bundling with renters/homeowners?**
A: Multi-policy discount available with most carriers. This is an upsell opportunity — ask about their renters or home situation. Note it during the call for follow-up.

**Q: What if the customer declines all offered coverages?**
A: At minimum, Texas requires 30/60/25 liability. Cannot issue a policy below state minimums. Document all declinations in writing (UM/UIM rejection form, PIP rejection form).

---

## AGENT SCRIPTS & TALKING POINTS

### How to offer UM/UIM:
"Texas has about 1 in 7 uninsured drivers. UM/UIM coverage protects you if one of them hits you. I'm required to offer it to you — it's your choice to accept or decline in writing. Do you want to add it?"

### How to offer PIP:
"PIP covers your medical bills and lost wages after an accident regardless of who caused it. It kicks in immediately — no waiting on fault determination. Want to add it?"

### How to explain SR-22:
"An SR-22 isn't insurance itself — it's a form your insurance company files with the state to certify that you have the required coverage. As long as your policy stays active, you're fine. If it ever cancels, they notify the state and your license can be suspended."

### How to explain excluded drivers:
"Excluding a driver means they are completely removed from coverage. If they ever drive one of your vehicles, there would be zero coverage for any accident — they'd be personally liable. Make sure they understand that."

---

## IMPORTANT REMINDERS FOR AGENTS
- NEVER guarantee a rate over the phone before binding — always bind through the carrier portal
- Misrepresentation on an application is grounds for policy rescission and possible fraud
- All rejection forms (UM/UIM, PIP) must be signed BEFORE binding
- If customer reveals a violation or accident NOT on their MVR, document it in your notes
- When in doubt, verify with your carrier underwriting department before binding
`;

export default CARRIER_KNOWLEDGE;
