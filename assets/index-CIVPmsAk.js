(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const re=JSON.parse(`[{"id":"tx-auto-um-offer","name":"UM/UIM Coverage Offer","category":"coverage_election","lineOfBusiness":"personal_auto","trigger":"start_application","triggerLabel":"Starting new auto application","required":true,"formRequired":true,"severity":"critical","statute":"TX Ins. Code §1952.101","disclosureText":"Texas law requires that we offer you Uninsured/Underinsured Motorist (UM/UIM) coverage. This coverage protects you if you are injured in an accident caused by a driver who has no insurance or not enough insurance to pay for your damages. UM/UIM coverage is optional, but if you choose to decline it, Texas law requires that you sign a written rejection form. Without a signed rejection, UM/UIM coverage will automatically be included in your policy at limits equal to your bodily injury liability limits.","agentNotes":"ALWAYS offer UM/UIM before quoting. If the customer declines, you MUST get their signature on the UM/UIM rejection form. Without a signed rejection, UM/UIM coverage is included by law. Keep the signed form on file — this protects you from E&O claims.","consequences":"If you fail to offer UM/UIM or fail to get a signed rejection, UM/UIM coverage is automatically included in the policy at the BI limit level. This could result in an E&O claim against you.","formName":"UM/UIM Coverage Selection/Rejection Form","order":1},{"id":"tx-auto-um-rejection","name":"UM/UIM Written Rejection","category":"coverage_election","lineOfBusiness":"personal_auto","trigger":"decline_um_uim","triggerLabel":"Customer declines UM/UIM","required":true,"formRequired":true,"severity":"critical","statute":"TX Ins. Code §1952.101(b)","disclosureText":"You have chosen to decline Uninsured/Underinsured Motorist (UM/UIM) coverage. Texas law requires that this rejection be in writing. By signing this rejection form, you acknowledge that you understand what UM/UIM coverage provides and that you are voluntarily choosing not to purchase it. You may add UM/UIM coverage at any time in the future by contacting your agent.","agentNotes":"Get the signed rejection form BEFORE binding the policy. This is your #1 E&O protection for auto. Make sure the customer understands what they're giving up — if they get hit by an uninsured driver, they'll have no coverage for their injuries beyond what the at-fault driver carries (which might be nothing).","consequences":"Without a signed written rejection, UM/UIM coverage is automatically included at the BI liability limits. The carrier will charge for it retroactively and you may face an E&O claim.","formName":"UM/UIM Rejection Form (Must be signed by named insured)","order":2},{"id":"tx-auto-pip-offer","name":"PIP Coverage Offer","category":"coverage_election","lineOfBusiness":"personal_auto","trigger":"start_application","triggerLabel":"Starting new auto application","required":true,"formRequired":true,"severity":"critical","statute":"TX Ins. Code §1952.151","disclosureText":"Texas law requires that we offer you Personal Injury Protection (PIP) coverage with a minimum of $2,500 per person. PIP is a no-fault coverage that pays for medical expenses, lost wages, and related costs for you and your passengers, regardless of who caused the accident. PIP benefits apply to costs incurred within three years of the accident. If you choose to decline PIP, Texas law requires a signed written rejection.","agentNotes":"PIP is the other big one — just like UM/UIM, you must offer it and get a signed rejection if the customer declines. Minimum offer is $2,500 per person, but most carriers offer $5,000 and $10,000 options. PIP pays on top of health insurance and covers passengers too. Many customers decline to save money, but make sure they UNDERSTAND what they're declining.","consequences":"Without a signed PIP rejection, PIP is automatically included in the policy at the minimum $2,500 level. E&O exposure if you fail to offer.","formName":"PIP Coverage Selection/Rejection Form","order":3},{"id":"tx-auto-pip-rejection","name":"PIP Written Rejection","category":"coverage_election","lineOfBusiness":"personal_auto","trigger":"decline_pip","triggerLabel":"Customer declines PIP","required":true,"formRequired":true,"severity":"critical","statute":"TX Ins. Code §1952.151(b)","disclosureText":"You have chosen to decline Personal Injury Protection (PIP) coverage. Texas law requires that this rejection be in writing. By signing this rejection form, you acknowledge that you understand what PIP coverage provides and that you are voluntarily choosing not to purchase it. You may add PIP coverage at any time by contacting your agent.","agentNotes":"Same drill as UM/UIM — get it signed before binding. Keep the form on file. If the customer later gets hurt and health insurance doesn't cover everything, they can't come back and say you never offered PIP.","consequences":"Without a signed rejection, PIP coverage is automatically included at $2,500 minimum. E&O exposure for agent.","formName":"PIP Rejection Form (Must be signed by named insured)","order":4},{"id":"tx-auto-excluded-driver","name":"Excluded Driver Acknowledgment","category":"driver_management","lineOfBusiness":"personal_auto","trigger":"exclude_driver","triggerLabel":"Excluding a driver from policy","required":true,"formRequired":true,"severity":"critical","statute":"TX Ins. Code §1952.0515","disclosureText":"You are requesting to exclude a named driver from your auto insurance policy. By signing the Named Driver Exclusion form, you acknowledge that the excluded driver will have ABSOLUTELY NO COVERAGE under this policy. If the excluded driver operates any vehicle listed on this policy and is involved in an accident, there will be NO LIABILITY COVERAGE, NO COLLISION COVERAGE, and NO COMPREHENSIVE COVERAGE for that incident. You will be personally responsible for any damages or injuries caused.","agentNotes":"This is a BIG deal — make sure the customer truly understands that excluding a driver means ZERO coverage if that person drives any of their vehicles. Common scenario: parent excludes teenage child with bad driving record to save premium, then teen borrows the car and causes an accident = no coverage at all. Always document the conversation.","consequences":"If you don't properly document the exclusion with a signed form, coverage disputes can arise. The carrier may deny a claim AND you could face an E&O claim from the customer saying they didn't understand the exclusion.","formName":"Named Driver Exclusion Form (Must be signed by named insured)","order":5},{"id":"tx-auto-prior-insurance","name":"Prior Insurance Verification","category":"prior_insurance","lineOfBusiness":"personal_auto","trigger":"start_application","triggerLabel":"Starting new auto application","required":true,"formRequired":false,"severity":"high","statute":"TX Ins. Code §2301.056","disclosureText":"To provide you with the most accurate quote, we need to verify your prior insurance history. Please provide your current or most recent insurance carrier name, policy number, coverage limits, and the dates of your coverage. A lapse in coverage of more than 30 days may affect your eligibility and premium with certain carriers.","agentNotes":"Prior insurance directly affects rates. Most preferred carriers require 6+ months of continuous coverage. A lapse = higher rates or non-standard market. Ask for their declarations page (dec page) if possible — it has everything you need. Check CLUE report for claims history. RED FLAG: If they say 'I've been covered' but can't provide carrier info, they may have a lapse they're not disclosing.","consequences":"Writing a policy without verifying prior insurance can result in mid-term cancellation if the carrier discovers a lapse. This hurts the customer and your loss ratio.","formName":null,"order":6},{"id":"tx-auto-hb2067","name":"HB 2067 — Written Explanation (New 2026 Law)","category":"new_law","lineOfBusiness":"personal_auto","trigger":"decline_cancel_nonrenew","triggerLabel":"Policy declined, canceled, or non-renewed","required":true,"formRequired":false,"severity":"high","statute":"HB 2067 (Effective Jan 1, 2026)","disclosureText":"Effective January 1, 2026, Texas House Bill 2067 requires insurance companies to automatically provide a written explanation to policyholders when an auto or home insurance policy is declined, canceled, or not renewed. You no longer need to request this explanation — the carrier must provide it proactively. If you have not received a written explanation for any policy action, contact your carrier or the Texas Department of Insurance.","agentNotes":"NEW LAW as of January 2026. Previously, customers had to formally request an explanation for decline/cancel/non-renewal. Now it's automatic. This is good for transparency but be aware: carriers must also submit quarterly reports to TDI summarizing their reasons. If you're helping a customer who was non-renewed, ask if they received their written explanation — if not, that's a compliance issue for the carrier.","consequences":"This is primarily a carrier obligation, not an agent obligation. But you should be aware of it so you can inform customers of their rights and help them if they don't receive the required explanation.","formName":null,"order":7},{"id":"tx-auto-minimum-coverage","name":"Texas Minimum Coverage Notice","category":"coverage_election","lineOfBusiness":"personal_auto","trigger":"coverage_selection","triggerLabel":"Selecting coverage limits","required":true,"formRequired":false,"severity":"high","statute":"TX Transp. Code §601.072","disclosureText":"Texas law requires all drivers to carry minimum liability insurance of 30/60/25: $30,000 per person for bodily injury, $60,000 per accident for bodily injury, and $25,000 for property damage. These are MINIMUMS and may not be sufficient to cover damages in a serious accident. We strongly recommend higher limits to better protect your assets. If you cause an accident with damages exceeding your policy limits, you are personally responsible for the difference.","agentNotes":"Always explain that 30/60/25 is the legal minimum but rarely adequate. A single ER visit can exceed $30K. Recommend at least 50/100/50 or 100/300/100 for better protection. If the customer has assets (home, savings), they NEED higher limits. This is also a good time to mention umbrella policies.","consequences":"Selling minimum limits isn't an E&O issue per se, but if a customer later realizes their limits were inadequate and claims you didn't explain the risk, it could become one. Document that you recommended higher limits.","formName":null,"order":8},{"id":"tx-auto-sr22","name":"SR-22 Filing Notice","category":"special_filing","lineOfBusiness":"personal_auto","trigger":"sr22_required","triggerLabel":"Customer needs SR-22 filing","required":true,"formRequired":false,"severity":"high","statute":"TX Transp. Code §601.153","disclosureText":"Based on your driving history, the State of Texas requires you to maintain an SR-22 certificate of financial responsibility. Your insurance carrier will file this SR-22 with the Texas Department of Public Safety (DPS) on your behalf. You must maintain continuous coverage for a minimum of 2 years. If your policy lapses, is canceled, or expires without replacement, the carrier is required to notify DPS, which may result in suspension of your driver's license and vehicle registration.","agentNotes":"SR-22 is triggered by DUI/DWI, driving without insurance, accumulation of violations, or at-fault accidents without coverage. Not all carriers file SR-22s — check which of your appointed carriers handle them. SR-22 customers typically pay higher premiums. The SR-22 requirement is usually for 2 years of CONTINUOUS coverage. If the policy lapses even for one day, the carrier notifies DPS and the license gets suspended again. Make this very clear to the customer.","consequences":"Failure to properly file the SR-22 or notify the customer about continuous coverage requirements could result in their license being suspended. E&O exposure if you promised to file and didn't.","formName":null,"order":9},{"id":"tx-auto-youthful-driver","name":"Youthful Driver Rating Disclosure","category":"driver_management","lineOfBusiness":"personal_auto","trigger":"add_young_driver","triggerLabel":"Adding driver under 25","required":false,"formRequired":false,"severity":"medium","statute":"General TX Rating Practices","disclosureText":"Adding a driver under age 25 to your policy will likely result in a significant premium increase due to statistical risk factors associated with younger, less experienced drivers. Good student discounts may be available if the driver maintains a B average or better. Completion of an approved defensive driving course may also reduce the premium. Some carriers offer usage-based or telematics programs that can help lower costs for young drivers who demonstrate safe driving habits.","agentNotes":"Youthful drivers are one of the biggest rate shocks for customers. Be upfront about the increase BEFORE they see the quote. Ask about good student discounts (usually need a transcript or report card), defensive driving courses, and telematics programs (like Allstate's Drivewise). Also mention: if the young driver has their OWN car, they might be better off on their own policy with some carriers. Compare both ways. If the customer wants to exclude the young driver instead — trigger the Excluded Driver disclosure.","consequences":"Not a legal requirement to disclose, but a best practice. If a customer is shocked by the rate increase and feels blindsided, it damages trust and can lead to complaints.","formName":null,"order":10}]`);class oe{constructor(){this.disclosures=re,this.activeDisclosures=[],this.completedDisclosures=[],this.callContext={lineOfBusiness:null,customerName:"",stage:"idle",triggers:new Set},this.listeners=new Set}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}_notify(){this.listeners.forEach(e=>e(this.getState()))}getState(){return{callContext:{...this.callContext,triggers:[...this.callContext.triggers]},activeDisclosures:[...this.activeDisclosures],completedDisclosures:[...this.completedDisclosures],allDisclosures:this.disclosures,stats:this.getStats()}}startCall(e,s=""){this.activeDisclosures=[],this.completedDisclosures=[],this.callContext={lineOfBusiness:e,customerName:s,stage:"intake",triggers:new Set},this.trigger("start_application")}endCall(){const e=this.getMissingRequired();return this.callContext.stage="idle",this._notify(),{completed:this.completedDisclosures.length,total:this.activeDisclosures.length+this.completedDisclosures.length,missingRequired:e}}trigger(e){if(this.callContext.triggers.has(e))return;this.callContext.triggers.add(e);const s=this.disclosures.filter(a=>a.trigger===e&&a.lineOfBusiness===this.callContext.lineOfBusiness&&!this.activeDisclosures.find(n=>n.id===a.id)&&!this.completedDisclosures.find(n=>n.id===a.id));return this.activeDisclosures.push(...s),this.activeDisclosures.sort((a,n)=>a.order-n.order),this._notify(),s}markCompleted(e){const s=this.activeDisclosures.findIndex(a=>a.id===e);if(s>=0){const[a]=this.activeDisclosures.splice(s,1);a.completedAt=new Date().toISOString(),this.completedDisclosures.push(a),this._notify()}}markIncomplete(e){const s=this.completedDisclosures.findIndex(a=>a.id===e);if(s>=0){const[a]=this.completedDisclosures.splice(s,1);delete a.completedAt,this.activeDisclosures.push(a),this.activeDisclosures.sort((n,o)=>n.order-o.order),this._notify()}}updateCustomerName(e){e&&this.callContext.stage!=="idle"&&(this.callContext.customerName=e,this._notify())}setStage(e){this.callContext.stage=e;const s={coverage:"coverage_selection",drivers:"start_application",review:"start_application"};s[e]&&this.trigger(s[e]),this._notify()}getMissingRequired(){return this.activeDisclosures.filter(e=>e.required)}getStats(){const e=this.activeDisclosures.length+this.completedDisclosures.length,s=this.completedDisclosures.length,a=this.activeDisclosures.filter(o=>o.required).length+this.completedDisclosures.filter(o=>o.required).length,n=this.completedDisclosures.filter(o=>o.required).length;return{total:e,completed:s,remaining:this.activeDisclosures.length,required:a,requiredCompleted:n,requiredRemaining:a-n,percentage:e>0?Math.round(s/e*100):0}}getAvailableTriggers(){const e=this.callContext.lineOfBusiness;if(!e)return[];const s=new Map;return this.disclosures.filter(a=>a.lineOfBusiness===e).forEach(a=>{s.has(a.trigger)||s.set(a.trigger,{key:a.trigger,label:a.triggerLabel,used:this.callContext.triggers.has(a.trigger),count:0}),s.get(a.trigger).count++}),[...s.values()]}reset(){this.activeDisclosures=[],this.completedDisclosures=[],this.callContext={lineOfBusiness:null,customerName:"",stage:"idle",triggers:new Set},this._notify()}}const v=new oe,Z=`
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
`,ee=`
# GABRIEL'S ESTRELLA AI SALES KNOWLEDGE BASE
# Outbound Cold-Call Reference — Oilfield & Trucking Sector

---

## WHO IS ESTRELLA AI?

Estrella AI is a boutique artificial intelligence agency serving small and mid-size businesses 
in the energy, trucking, logistics, and professional services sectors. We design, build, and 
deploy custom AI agents that automate the repetitive, time-consuming work your team does 
every day — so your people can focus on what actually moves the needle.

Founded in the Permian Basin region, Estrella AI understands the Southeastern New Mexico 
and West Texas market. We don't sell generic software — we build smart, practical AI systems 
tailored to how your business actually operates.

---

## ESTRELLA AI PRODUCT SUITE

### 1. AI RECEPTIONIST AGENT
**What it is:** A 24/7 virtual front desk that answers calls, responds to texts/emails, 
qualifies leads, schedules appointments, and handles FAQs — completely automatically.

**Best for:** Oilfield service companies, trucking dispatchers, any business that gets 
after-hours calls and misses revenue because no one picked up.

**Key benefits:**
- Never misses a call — answers 24/7, 365 days a year
- Qualifies inbound leads immediately (asks the right questions)
- Books appointments directly into your calendar
- Can hand off to a human when needed (warm transfer)
- Bilingual English/Spanish support available

**Typical pricing:** Starting at $497/month (setup + monthly retainer, no per-minute fees). 
Custom pricing for high-volume or complex workflows.

**ROI example:** One missed oilfield service call can be worth thousands. The receptionist 
pays for itself the moment it catches a single job you would have lost overnight.

---

### 2. AI SALES & OUTREACH AGENT
**What it is:** An AI-powered prospecting system that researches leads, sends personalized 
outreach (text and email), follows up automatically, and hands warm leads to your sales team.

**Best for:** Companies trying to grow without adding sales headcount. Trucking companies 
prospecting for new contracts. Oilfield companies expanding their customer base.

**Key benefits:**
- Builds and works a pipeline automatically
- Sends human-sounding follow-up texts and emails
- Re-engages cold leads without you lifting a finger
- Tracks every conversation in one dashboard
- Works alongside your existing CRM or standalone

**Typical pricing:** Starting at $797/month. Includes outreach automation + reporting dashboard.

---

### 3. AI OPERATIONS ASSISTANT
**What it is:** A custom AI chatbot trained on your company's documents, procedures, 
pricing, and data — deployed internally so your team can get answers instantly without 
calling you or digging through files.

**Best for:** Owner-operators who are the "single source of truth." Companies with a lot 
of tribal knowledge. Teams that waste time on internal back-and-forth.

**Key benefits:**
- Trained on YOUR documents, pricing sheets, procedures, contracts
- Accessible via web chat, text, or embedded in your existing tools
- Answers staff questions instantly (pricing, procedures, load specs, etc.)
- Reduces owner-operator interruptions dramatically
- Keeps your IP in-house — not on a public AI model

**Typical pricing:** Starting at $697/month. One-time setup fee varies by complexity.

---

### 4. AI DISPATCH & SCHEDULING ASSISTANT (Trucking / Hotshot)
**What it is:** An AI dispatcher that handles inbound load requests, checks driver 
availability, confirms rates, sends dispatches, and tracks loads — all automatically.

**Best for:** Small trucking fleets, hotshot operators, logistics companies with 1-20 trucks.

**Key benefits:**
- Takes load requests by text/call 24/7
- Automatically matches loads to available drivers
- Sends dispatch confirmations via text
- Tracks status and sends customer updates
- Reduces dispatcher workload by 40-60%

**Typical pricing:** Starting at $997/month for full dispatch automation.

---

### 5. CUSTOM AI WORKFLOWS (Enterprise / Complex Builds)
**What it is:** End-to-end custom AI automation built around your specific business problem. 
Could include invoice processing, safety compliance reporting, driver screening, 
or any repeatable workflow that currently takes hours of manual work.

**Typical pricing:** Project-based — starts at $2,500 for discovery + build. 
Retainer for ongoing maintenance/improvements.

---

## PRICING OVERVIEW (Quick Reference)

| Product | Starting Price | Notes |
|---|---|---|
| AI Receptionist | $497/month | Most popular entry point |
| AI Sales & Outreach | $797/month | Add-on to Receptionist |
| AI Operations Assistant | $697/month | Internal knowledge bot |
| AI Dispatch Assistant | $997/month | Trucking/hotshot focused |
| Custom Workflow | $2,500+ project | Complex / enterprise |
| Bundle Discount | Ask about bundles | 10-15% off for 2+ products |

**Setup fees:** Vary by product. Typically 1x the monthly rate. Waived during promotions.

**Contracts:** Month-to-month available. Discounts for 6-month or annual commitments (10-20% off).

**Free trial / pilot:** On a case-by-case basis for qualified prospects. 30-day pilot available.

---

## CALL FLOW GUIDE

### Phase 1: OPENER (First 30 seconds)
Goal: Get them to stay on the phone. Be direct, confident, human.

Suggested opener:
"Hi, this is [Agent Name] calling from Estrella AI. I'll be quick — we work with 
trucking and oilfield companies in the Permian Basin to set up AI systems that help 
them capture more business without adding headcount. Is [business name] still taking 
on new work right now?"

→ If YES or curious: Transition to qualify.
→ If "we're not interested": Pivot to pain point. ("Totally understand — out of curiosity, 
  is there a specific headache — like after-hours calls or chasing down leads — that 
  your team deals with most?")

---

### Phase 2: QUALIFY (Key Discovery Questions)
Goal: Understand their biggest pain point so you match the right product.

Ask 2-3 of these:
- "How does your team currently handle calls and customer inquiries?"
- "Does someone at your company answer the phones after hours, or do you lose those calls?"
- "How are you currently finding new customers / contracts?"
- "How many trucks / crews are you running?"
- "Is there one part of the operations that feels like it takes way too much manual effort?"
- "Are you the one making most of these decisions, or is there someone else I should loop in?"

---

### Phase 3: PITCH (Match Product to Pain)
Goal: Speak directly to what they just told you, not a generic pitch.

Examples:
- Missing after-hours calls → Pitch AI Receptionist
- Growing without salespeople → Pitch AI Sales & Outreach Agent
- Team constantly asking the owner questions → Pitch AI Operations Assistant
- Dispatching chaos, small fleet → Pitch AI Dispatch Assistant

Lead with the outcome, not the technology:
"A lot of companies like yours tell us they're losing 2-3 jobs a week just because 
nobody answered after 5pm. Our AI Receptionist fixes that — it answers every call, 
qualifies the job, and texts you the details. You never miss another one."

---

### Phase 4: HANDLE OBJECTIONS (See section below)

---

### Phase 5: CLOSE / NEXT STEP
Goal: Always get a concrete next step — never end a call with "I'll send you something."

Options:
- "Can we set up a 20-minute demo this week? I can walk you through exactly how it 
  would work for [their business name]."
- "Would Thursday or Friday work for a quick screen share?"
- "I can send you a one-pager on that — what's your email? And do you mind if I 
  follow up by text too?"

---

## COMMON OBJECTIONS & REBUTTALS

### "We already have someone who handles that."
"That's great — most of our clients actually still have their staff, they just have the AI 
handle the after-hours or overflow so their people aren't burning out. It works alongside 
your team, not instead of them. What does your current setup look like?"

### "We're not interested."
"No worries at all. I'll be honest — most people say that at first. I'm just curious, 
is it more that the timing isn't right, or does AI automation not feel like a fit for 
where you are right now?"

### "Just send me an email / info."
"Sure, I can do that — I just want to make sure I'm sending you the right thing. 
Quick question: is the bigger issue for you capturing leads you're currently missing, 
or reducing the manual work your team does day-to-day?"
(Then send a targeted one-pager, not a generic brochure.)

### "We can't afford it."
"I hear you — what's your rough budget for something like this? I ask because 
our entry-level product is $497 a month, and most clients recoup that with a 
single job they used to miss. I don't want to waste your time if the numbers 
truly don't work, but I also don't want you to miss out if they do."

### "We tried AI before and it didn't work."
"That's fair — a lot of off-the-shelf AI tools are pretty generic. What we do is 
custom-built around how your specific business works. What didn't work about 
what you tried before?"

### "I need to talk to my partner / spouse / manager."
"Of course. Would it make sense to do a quick demo with both of you on the call 
so you have all the info? I can do 20 minutes — it'll save you from playing telephone."

### "We're too small for something like that."
"Actually, our sweetspot is companies with 1 to 25 employees. Bigger companies 
have IT departments for this stuff — the real ROI is for owner-operators like 
yourself who are running lean and need leverage. What size is your team right now?"

### "I'm busy right now."
"Totally get it — I'll be quick. One question: are you losing any jobs because 
calls are going to voicemail after hours? If not, I'll let you go. If yes, it's 
worth 3 more minutes. Which is it?"

---

## BUYER QUESTIONS & ANSWERS

**Q: How long does setup take?**
A: Most products are live within 5-10 business days after we gather your business info. 
Complex custom builds take 3-6 weeks.

**Q: Do I need to sign a long contract?**
A: Month-to-month is available. We also offer 6-month and annual plans with 10-20% discounts 
for clients who want to lock in the rate.

**Q: Will the AI sound robotic?**
A: No — our AI agents are trained to sound natural and conversational. We customize the 
voice and personality to match your brand. Most callers don't realize they're talking to AI 
until they're told.

**Q: What happens if the AI can't answer something?**
A: It hands off to you or a team member seamlessly. You can set escalation rules — 
e.g., "If they say it's an emergency, text me immediately."

**Q: Does it work with my existing phone number?**
A: Yes. We can forward your existing number to the AI or provision a new one — whichever 
you prefer.

**Q: Is my data safe?**
A: Yes. We use enterprise-grade infrastructure. Your business data and customer info 
are never sold or used to train public AI models.

**Q: Do you offer a demo?**
A: Absolutely. A 20-minute live demo is the best way to see exactly how it would work 
for your business. We can set that up this week.

**Q: Can I try it before committing?**
A: For qualified prospects, we offer a 30-day pilot program. Ask about availability 
and terms — it depends on the product and current capacity.

**Q: How is Estrella AI different from a generic chatbot?**
A: Generic chatbots are off-the-shelf. What we build is custom — trained on your 
business, your pricing, your workflow. It behaves like a knowledgeable employee, 
not a FAQ machine.

**Q: Do you serve companies outside the Permian Basin?**
A: Yes — we can serve any business remotely. We started in the Permian Basin but 
our clients are across the U.S.

---

## KEY METRICS TO CAPTURE FROM THE PROSPECT

During the call, Gabriel will flag and capture these key data points:
- Decision maker name and title
- Number of employees / trucks / crew size
- Biggest pain point / main reason they might buy
- Current solution (if any) they're using
- Budget range (if mentioned)
- Callback preference (date/time)
- Email address
- Best contact number (if different from the one called)
`,le="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",y={AUTO_FILL:"AUTO_FILL",TRIGGER:"TRIGGER",ALERT:"ALERT",ANSWER:"ANSWER",SILENCE:"SILENCE",TALK_TRACK:"TALK_TRACK",OBJECTION:"OBJECTION",CAPTURE:"CAPTURE",QUALIFY:"QUALIFY"};class ce{constructor(){const e="AIzaSyCMuoSn0jw2Tu_cDhlFH0CjfWbf9K4WhhA",s=localStorage.getItem("gabriel_gemini_key")||"";this._apiKey=e,e!==s&&localStorage.setItem("gabriel_gemini_key",e),this._conversationHistory=[],this._callContext=null,this._listeners=new Set,this._processing=!1}setApiKey(e){this._apiKey=e,localStorage.setItem("gabriel_gemini_key",e)}getApiKey(){return this._apiKey}hasApiKey(){return!!this._apiKey&&this._apiKey.length>10}setCallContext(e){this._callContext=e}clearHistory(){this._conversationHistory=[]}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_emit(e){this._listeners.forEach(s=>s(e))}_buildSystemPrompt(e="qa"){const s=this._callContext,a=s?`
## LIVE CALL CONTEXT
- Customer Name: ${s.customerName||"Unknown"}
- Line of Business: ${s.lineOfBusiness||"Not started"}
- Application Stage: ${s.stage||"idle"}
- Disclosures Triggered: ${(s.triggers||[]).join(", ")||"None yet"}
- Disclosures Completed: ${(s.completedDisclosures||[]).map(n=>n.name).join(", ")||"None yet"}
- Disclosures Still Active: ${(s.activeDisclosures||[]).map(n=>n.name).join(", ")||"None"}
`:`
## LIVE CALL CONTEXT
No active call.
`;if(e==="qa")return`You are Gabriel, an elite Texas insurance compliance copilot. You sit beside the agent like a trusted partner — you know the rules, the products, the "what ifs," and you answer in plain, confident English. You are never wishy-washy. You give the agent the direct answer they need to keep the call moving.

RULES:
- Always answer based on the knowledge base first. When general TX insurance law applies and isn't covered in the KB, you may use that knowledge.
- Be concise. Agents are on a live call — 2-4 sentences max unless a topic requires more detail.
- Never make up carrier-specific rates or binding decisions.
- If the agent asks something outside TX personal auto, acknowledge the scope and give what general guidance you can.
- Speak directly to the agent (not the customer).

${a}

${Z}`;if(e==="reactive")return`You are Gabriel, a real-time AI insurance compliance copilot listening to a live insurance sales call. Your job is to silently analyze each transcript chunk and output structured JSON reactions ONLY when something actionable is detected.

REACTION SCHEMA (output as JSON):
{
  "type": "AUTO_FILL" | "TRIGGER" | "ALERT" | "ANSWER" | "SILENCE",
  "field": "customerName" | "vin" | "address" | null,   // for AUTO_FILL
  "value": "extracted value",                            // for AUTO_FILL
  "triggerKey": "decline_pip" | "decline_um_uim" | "exclude_driver" | "sr22_required" | "add_young_driver" | "coverage_selection" | "decline_cancel_nonrenew" | null,
  "message": "Brief message to display in the agent pane"
}

RULES:
- Output ONLY valid JSON. No markdown fences. No explanation text.
- If nothing actionable: output {"type":"SILENCE"}
- For AUTO_FILL: only extract if you are confident (>90%) the customer stated this value directly
- For TRIGGER: only suggest if the transcript clearly matches a trigger scenario
- For ALERT: flag unusual or risky statements (lapse in coverage, undisclosed violations, etc.)
- For ANSWER: only if a direct question is asked that you can answer from the KB
- Keep messages SHORT — max 15 words. Agents are on a call.
- Prefer SILENCE over false positives. Do not spam the agent.

AVAILABLE TRIGGERS:
- decline_um_uim: customer declines UM/UIM coverage
- decline_pip: customer declines PIP coverage
- exclude_driver: agent/customer wants to exclude a driver
- sr22_required: SR-22 mentioned or required
- add_young_driver: driver under 25 being added
- coverage_selection: customer choosing coverage levels
- decline_cancel_nonrenew: customer mentions cancellation or non-renewal

${a}

${Z}`;if(e==="cold_call"){const n=this._leadContext;return`You are Gabriel, an elite outbound sales copilot for Estrella AI. You are listening to a live cold call and your job is to silently analyze each transcript chunk and output structured JSON reactions ONLY when something actionable is detected. Help the agent stay sharp, handle objections, capture key info, and close toward a next step.

REACTION SCHEMA (output as JSON):
{
  "type": "TALK_TRACK" | "OBJECTION" | "CAPTURE" | "QUALIFY" | "ALERT" | "SILENCE",
  "field": string | null,   // for CAPTURE: what data point was captured (e.g. "decisionMaker", "fleetSize", "budget", "callbackDate", "email")
  "value": string | null,   // for CAPTURE: the extracted value
  "message": "Brief message or suggested line for the agent"
}

RULES:
- Output ONLY valid JSON. No markdown fences. No explanation text.
- If nothing actionable: output {"type":"SILENCE"}
- TALK_TRACK: suggest the agent's next line when the conversation needs direction
- OBJECTION: when the prospect voices a concern — always include a specific suggested rebuttal in "message"
- CAPTURE: when the prospect reveals key info (name, role, fleet size, budget, callback time, email) — extract it
- QUALIFY: when you learn something that helps assess fit (pain point, current solution, decision timeline)
- ALERT: flag important moments (e.g. prospect said they're in a meeting, legal/compliance issue mentioned)
- Keep messages SHORT — max 20 words for talk tracks, 25 for objection rebuttals.
- Prefer SILENCE over noise. One great suggestion beats five mediocre ones.
- Never suggest making up pricing/features not in the KB.

${n?`
## ACTIVE PROSPECT
- Business Name: ${n.name||"Unknown"}
- Category: ${n.category||"Unknown"}
- Phone: ${n.phone||"Unknown"}
- City/State: ${[n.city,n.state].filter(Boolean).join(", ")||"Unknown"}
- Call Count (including this call): ${(n.callCount||0)+1}
- Prior Notes: ${n.notes||"None"}
- Previously Captured: ${JSON.stringify(n.capturedData||{})}
`:`
## ACTIVE PROSPECT
No lead loaded.
`}

${ee}`}if(e==="cold_call_qa"){const n=this._leadContext;return`You are Gabriel, an elite outbound sales copilot for Estrella AI. The agent is on a cold call and needs an immediate answer. You are their real-time sales expert — answer concisely and confidently so they can stay in the conversation.

RULES:
- Be direct. 2-3 sentences max unless nuance is truly required.
- Ground answers in the Estrella AI Knowledge Base below.
- Never make up pricing, products, or guarantees not in the KB.
- Speak directly to the agent (not the prospect).
- If they ask a product question, give the answer AND suggest how to pivot it back into the conversation.

${n?`## ACTIVE PROSPECT
- Business: ${n.name} (${n.category}) — ${[n.city,n.state].filter(Boolean).join(", ")}
`:""}

${ee}`}return""}async _callGemini(e,s){var l,p,g,b,S,O;if(!this.hasApiKey())throw new Error("NO_API_KEY");const a={system_instruction:{parts:[{text:s}]},contents:e,generationConfig:{temperature:.3,maxOutputTokens:1024,topP:.8},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_NONE"}]},n=await fetch(`${le}?key=${this._apiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!n.ok){const _=await n.json().catch(()=>({}));throw new Error(((l=_==null?void 0:_.error)==null?void 0:l.message)||`API error ${n.status}`)}const o=await n.json();return((O=(S=(b=(g=(p=o==null?void 0:o.candidates)==null?void 0:p[0])==null?void 0:g.content)==null?void 0:b.parts)==null?void 0:S[0])==null?void 0:O.text)||""}async ask(e,s=null){if(s&&this.setCallContext(s),!this._processing){this._processing=!0,this._emit({type:"THINKING"}),this._conversationHistory.push({role:"user",parts:[{text:e}]});try{const a=this._buildSystemPrompt("qa"),n=await this._callGemini(this._conversationHistory,a);return this._conversationHistory.push({role:"model",parts:[{text:n}]}),this._emit({type:y.ANSWER,message:n,source:"manual",timestamp:new Date().toISOString()}),n}catch(a){return this._emit({type:"ERROR",message:a.message}),null}finally{this._processing=!1}}}async analyzeTranscript(e,s=null){if(s&&this.setCallContext(s),this._processing||!e||e.trim().length<8)return null;this._processing=!0;try{const a=this._buildSystemPrompt("reactive"),n=[{role:"user",parts:[{text:`TRANSCRIPT CHUNK:
"${e}"`}]}],o=await this._callGemini(n,a);let l;try{const g=o.replace(/```json?\n?/gi,"").replace(/```/g,"").trim();l=JSON.parse(g)}catch{return null}if(!l||l.type===y.SILENCE)return null;const p={...l,source:"speech",timestamp:new Date().toISOString()};return this._emit(p),p}catch(a){return console.warn("[Gabriel AI] Reactive analysis error:",a.message),null}finally{this._processing=!1}}async translateToEnglish(e){if(!this.hasApiKey()||!(e!=null&&e.trim()))return null;try{const s=`You are a professional Spanish-to-English translator. 
Translate the input text from Spanish to natural, conversational English.
Output ONLY the translated text — no explanations, no quotation marks, no notes.`,a=[{role:"user",parts:[{text:e.trim()}]}],n=await this._callGemini(a,s);return(n==null?void 0:n.trim())||null}catch(s){return console.warn("[Gabriel AI] translateToEnglish error:",s.message),null}}async translateToSpanish(e){if(!this.hasApiKey()||!(e!=null&&e.trim()))return null;try{const s=`You are a professional English-to-Spanish translator for insurance calls in Texas.
Translate the input text from English to clear, professional Mexican Spanish (formal "usted" register).
Output ONLY the translated text — no explanations, no quotation marks, no notes.`,a=[{role:"user",parts:[{text:e.trim()}]}],n=await this._callGemini(a,s);return(n==null?void 0:n.trim())||null}catch(s){return console.warn("[Gabriel AI] translateToSpanish error:",s.message),null}}setLeadContext(e){this._leadContext=e}clearLeadContext(){this._leadContext=null}async analyzeColdCall(e,s=null){if(s&&this.setLeadContext(s),this._processing||!e||e.trim().length<8)return null;this._processing=!0;try{const a=this._buildSystemPrompt("cold_call"),n=[{role:"user",parts:[{text:`TRANSCRIPT CHUNK:
"${e}"`}]}],o=await this._callGemini(n,a);let l;try{const g=o.replace(/```json?\n?/gi,"").replace(/```/g,"").trim();l=JSON.parse(g)}catch{return null}if(!l||l.type===y.SILENCE)return null;const p={...l,source:"speech",timestamp:new Date().toISOString()};return this._emit(p),p}catch(a){return console.warn("[Gabriel AI] Cold-call analysis error:",a.message),null}finally{this._processing=!1}}async askColdCall(e,s=null){if(s&&this.setLeadContext(s),!this._processing){this._processing=!0,this._emit({type:"THINKING"}),this._conversationHistory.push({role:"user",parts:[{text:e}]});try{const a=this._buildSystemPrompt("cold_call_qa"),n=await this._callGemini(this._conversationHistory,a);return this._conversationHistory.push({role:"model",parts:[{text:n}]}),this._emit({type:y.ANSWER,message:n,source:"manual",timestamp:new Date().toISOString()}),n}catch(a){return this._emit({type:"ERROR",message:a.message}),null}finally{this._processing=!1}}}onCallStart(e){this.setCallContext(e),this.clearHistory()}onCallEnd(){this._callContext=null,this._leadContext=null,this.clearHistory()}}const f=new ce,de="wss://api.deepgram.com/v1/listen",h={IDLE:"idle",CONNECTING:"connecting",LISTENING:"listening",PAUSED:"paused",ERROR:"error"};class ue{constructor(){const e="8de638b433e6bf495dbcf5ad46a01220d9ee8179",s=localStorage.getItem("gabriel_deepgram_key")||"";this._apiKey=e,e!==s&&localStorage.setItem("gabriel_deepgram_key",e),this._deviceId=localStorage.getItem("gabriel_mic_device")||null,this._ws=null,this._mediaRecorder=null,this._stream=null,this._status=h.IDLE,this._listeners=new Set,this._transcriptBuffer=[],this._bufferMaxSeconds=60,this._keepAliveInterval=null,this._reconnectAttempts=0,this._maxReconnectAttempts=3}setApiKey(e){this._apiKey=e,localStorage.setItem("gabriel_deepgram_key",e)}getApiKey(){return this._apiKey}hasApiKey(){return!!this._apiKey&&this._apiKey.length>10}setDeviceId(e){this._deviceId=e||null,e?localStorage.setItem("gabriel_mic_device",e):localStorage.removeItem("gabriel_mic_device")}getDeviceId(){return this._deviceId}getStatus(){return this._status}getTranscriptBuffer(){return[...this._transcriptBuffer]}getRecentTranscript(e=30){const s=Date.now()-e*1e3;return this._transcriptBuffer.filter(a=>a.timestamp>=s).map(a=>`${a.speaker?`[${a.speaker}] `:""}${a.text}`).join(" ")}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_emit(e){this._listeners.forEach(s=>s(e))}_setStatus(e){this._status=e,this._emit({type:"STATUS_CHANGE",status:e})}async start(){if(!this.hasApiKey())return this._emit({type:"ERROR",message:"Deepgram API key not configured. Open Settings."}),!1;if(this._status===h.LISTENING)return!0;this._setStatus(h.CONNECTING);try{const a={channelCount:1,sampleRate:16e3,echoCancellation:!this._deviceId,noiseSuppression:!this._deviceId};this._deviceId&&(a.deviceId={exact:this._deviceId}),this._stream=await navigator.mediaDevices.getUserMedia({audio:a})}catch(a){return this._setStatus(h.ERROR),this._emit({type:"ERROR",message:`Microphone access denied: ${a.message}. Please allow mic access and try again.`}),!1}const e=new URLSearchParams({model:"nova-2",language:"en-US",smart_format:"true",punctuate:"true",diarize:"true",interim_results:"true",utterance_end_ms:"1500",endpointing:"400"}),s=`${de}?${e}`;try{this._ws=new WebSocket(s,["token",this._apiKey])}catch(a){return this._setStatus(h.ERROR),this._emit({type:"ERROR",message:"Failed to connect to Deepgram: "+a.message}),this._stream.getTracks().forEach(n=>n.stop()),!1}return this._ws.onopen=()=>{this._reconnectAttempts=0,this._setStatus(h.LISTENING),this._emit({type:"CONNECTED"}),this._startMediaRecorder(),this._keepAliveInterval=setInterval(()=>{var a;((a=this._ws)==null?void 0:a.readyState)===WebSocket.OPEN&&this._ws.send(JSON.stringify({type:"KeepAlive"}))},8e3)},this._ws.onmessage=a=>{this._handleDeepgramMessage(a.data)},this._ws.onerror=a=>{this._setStatus(h.ERROR),this._emit({type:"ERROR",message:"Deepgram connection error. Check your API key."}),this.stop()},this._ws.onclose=a=>{clearInterval(this._keepAliveInterval),this._keepAliveInterval=null,this._mediaRecorder&&this._mediaRecorder.state!=="inactive"&&(this._mediaRecorder.stop(),this._mediaRecorder=null),this._status===h.LISTENING?this._reconnectAttempts<this._maxReconnectAttempts?(this._reconnectAttempts++,this._emit({type:"RECONNECTING",attempt:this._reconnectAttempts,max:this._maxReconnectAttempts,message:`Deepgram disconnected. Reconnecting… (${this._reconnectAttempts}/${this._maxReconnectAttempts})`}),setTimeout(()=>this.start(),1e3)):(this._setStatus(h.ERROR),this._emit({type:"ERROR",message:`Deepgram connection lost after ${this._maxReconnectAttempts} reconnect attempts. Check your API key or network.`})):this._setStatus(h.IDLE)},!0}_startMediaRecorder(){try{this._mediaRecorder=new MediaRecorder(this._stream,{mimeType:MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"audio/webm"}),this._mediaRecorder.ondataavailable=e=>{var s;e.data.size>0&&((s=this._ws)==null?void 0:s.readyState)===WebSocket.OPEN&&this._ws.send(e.data)},this._mediaRecorder.start(100)}catch(e){this._setStatus(h.ERROR),this._emit({type:"ERROR",message:"Failed to start audio recording: "+e.message})}}_handleDeepgramMessage(e){var s,a;try{const n=JSON.parse(e);if(n.type==="Results"){const o=(a=(s=n.channel)==null?void 0:s.alternatives)==null?void 0:a[0];if(!o||!o.transcript)return;const l=o.transcript.trim();if(!l)return;const p=n.is_final,g=this._getSpeakerLabel(n);if(p){this._transcriptBuffer.push({text:l,speaker:g,timestamp:Date.now(),isFinal:!0});const b=Date.now()-this._bufferMaxSeconds*1e3;this._transcriptBuffer=this._transcriptBuffer.filter(S=>S.timestamp>=b),this._emit({type:"TRANSCRIPT_FINAL",text:l,speaker:g,fullBuffer:this.getRecentTranscript(30)})}else this._emit({type:"TRANSCRIPT_INTERIM",text:l,speaker:g})}n.type==="SpeechStarted"&&this._emit({type:"SPEECH_STARTED"}),n.type==="UtteranceEnd"&&this._emit({type:"UTTERANCE_END"})}catch{}}_getSpeakerLabel(e){var a,n,o,l;const s=(l=(o=(n=(a=e.channel)==null?void 0:a.alternatives)==null?void 0:n[0])==null?void 0:o.words)==null?void 0:l[0];return(s==null?void 0:s.speaker)!==void 0?s.speaker===0?"Agent":"Customer":null}stop(){clearInterval(this._keepAliveInterval),this._keepAliveInterval=null,this._reconnectAttempts=this._maxReconnectAttempts,this._mediaRecorder&&this._mediaRecorder.state!=="inactive"&&this._mediaRecorder.stop(),this._ws&&this._ws.readyState===WebSocket.OPEN&&(this._ws.send(JSON.stringify({type:"CloseStream"})),this._ws.close()),this._stream&&(this._stream.getTracks().forEach(e=>e.stop()),this._stream=null),this._ws=null,this._mediaRecorder=null,this._reconnectAttempts=0,this._setStatus(h.IDLE),this._emit({type:"DISCONNECTED"})}clearBuffer(){this._transcriptBuffer=[]}onCallEnd(){this.stop(),this.clearBuffer()}}const I=new ue,pe="gabriel_leads",me=1,E="leads";class he{constructor(){this._db=null,this._ready=!1,this._readyPromise=null}init(){return this._readyPromise?this._readyPromise:(this._readyPromise=new Promise((e,s)=>{const a=indexedDB.open(pe,me);a.onupgradeneeded=n=>{const o=n.target.result;if(!o.objectStoreNames.contains(E)){const l=o.createObjectStore(E,{keyPath:"id"});l.createIndex("status","status",{unique:!1}),l.createIndex("category","category",{unique:!1}),l.createIndex("lastCalled","lastCalled",{unique:!1}),l.createIndex("name","name",{unique:!1})}},a.onsuccess=n=>{this._db=n.target.result,this._ready=!0,e(this._db)},a.onerror=n=>{console.error("[LeadDB] Failed to open database:",n.target.error),s(n.target.error)}}),this._readyPromise)}_ensureReady(){if(!this._ready)throw new Error("LeadDatabase not initialized. Call init() first.");return this._db}getAllLeads(){const e=this._ensureReady();return new Promise((s,a)=>{const l=e.transaction(E,"readonly").objectStore(E).getAll();l.onsuccess=()=>s(l.result||[]),l.onerror=p=>a(p.target.error)})}getLead(e){const s=this._ensureReady();return new Promise((a,n)=>{const p=s.transaction(E,"readonly").objectStore(E).get(e);p.onsuccess=()=>a(p.result||null),p.onerror=g=>n(g.target.error)})}saveLead(e){const s=this._ensureReady(),a=new Date().toISOString(),n={status:"new",lastCalled:null,callbackDate:null,callCount:0,notes:"",capturedData:{},createdAt:a,...e,id:e.id||crypto.randomUUID(),updatedAt:a};return new Promise((o,l)=>{const b=s.transaction(E,"readwrite").objectStore(E).put(n);b.onsuccess=()=>o(n),b.onerror=S=>l(S.target.error)})}updateLead(e,s){return this.getLead(e).then(a=>{if(!a)throw new Error(`Lead ${e} not found`);const n={...a,...s,id:e,updatedAt:new Date().toISOString()};return this.saveLead(n)})}deleteLead(e){const s=this._ensureReady();return new Promise((a,n)=>{const p=s.transaction(E,"readwrite").objectStore(E).delete(e);p.onsuccess=()=>a(!0),p.onerror=g=>n(g.target.error)})}clearAll(){const e=this._ensureReady();return new Promise((s,a)=>{const l=e.transaction(E,"readwrite").objectStore(E).clear();l.onsuccess=()=>s(!0),l.onerror=p=>a(p.target.error)})}getCount(){const e=this._ensureReady();return new Promise((s,a)=>{const l=e.transaction(E,"readonly").objectStore(E).count();l.onsuccess=()=>s(l.result),l.onerror=p=>a(p.target.error)})}async importFromCSV(e){var p,g,b,S,O,_,P,M;const s=e.trim().split(`
`);if(s.length<2)return{imported:0,skipped:0};const a=te(s[0]).map($=>$.trim().toLowerCase()),n={name:a.indexOf("business name"),phone:a.indexOf("phone"),address:a.indexOf("address"),city:a.indexOf("city"),state:a.indexOf("state"),website:a.indexOf("website"),category:a.indexOf("category"),source:a.indexOf("source")};let o=0,l=0;for(let $=1;$<s.length;$++){const B=s[$].trim();if(!B)continue;const A=te(B),N=((p=A[n.name])==null?void 0:p.trim())||"";if(!N){l++;continue}const q={name:N,phone:((g=A[n.phone])==null?void 0:g.trim())||"",address:((b=A[n.address])==null?void 0:b.trim())||"",city:((S=A[n.city])==null?void 0:S.trim())||"",state:((O=A[n.state])==null?void 0:O.trim())||"",website:((_=A[n.website])==null?void 0:_.trim())||"",category:((P=A[n.category])==null?void 0:P.trim())||"Unknown",source:((M=A[n.source])==null?void 0:M.trim())||"Import"};try{await this.saveLead(q),o++}catch{l++}}return{imported:o,skipped:l}}async getLeadsByStatus(e){return(await this.getAllLeads()).filter(a=>a.status===e)}async getNextNewLead(){return(await this.getAllLeads()).find(s=>s.status==="new")||null}async getStats(){const e=await this.getAllLeads(),s={total:e.length,new:0,called:0,interested:0,callback:0,not_interested:0,no_answer:0,closed:0};return e.forEach(a=>{s[a.status]!==void 0&&s[a.status]++}),s}}function te(i){const e=[];let s="",a=!1;for(let n=0;n<i.length;n++){const o=i[n];o==='"'?a&&i[n+1]==='"'?(s+='"',n++):a=!a:o===","&&!a?(e.push(s),s=""):s+=o}return e.push(s),e}const R=new he;class ge{constructor(){this._listeners=new Set,this._callActive=!1,this._callStartTime=null,this._timerInterval=null}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_emit(e){this._listeners.forEach(s=>s(e))}formatNumber(e){if(!e)return null;const s=e.replace(/[^\d]/g,"");return s.length===10?`+1${s}`:s.length===11&&s.startsWith("1")?`+${s}`:e.startsWith("+")&&s.length>=10?`+${s}`:null}call(e){const s=this.formatNumber(e);return s?(window.location.href=`tel:${s}`,this._callActive=!0,this._callStartTime=Date.now(),this._startTimer(),this._emit({type:"LAUNCHED",number:s,displayNumber:this.formatDisplay(s),message:`Dialing ${this.formatDisplay(s)}…`}),!0):(this._emit({type:"ERROR",message:`Could not parse phone number: "${e}". Use format (555) 867-5309.`}),!1)}launchGoogleVoice(e){return this.call(e)}formatDisplay(e){if(!e)return"";const s=e.replace(/\D/g,"");if(s.length===11&&s.startsWith("1")){const a=s.slice(1,4),n=s.slice(4,7),o=s.slice(7);return`(${a}) ${n}-${o}`}return e}_startTimer(){this._timerInterval=setInterval(()=>{const e=Math.floor((Date.now()-this._callStartTime)/1e3),s=String(Math.floor(e/60)).padStart(2,"0"),a=String(e%60).padStart(2,"0");this._emit({type:"TIMER",elapsed:e,display:`${s}:${a}`})},1e3)}endCall(){if(!this._callActive)return;clearInterval(this._timerInterval),this._timerInterval=null,this._callActive=!1;const e=this._callStartTime?Math.floor((Date.now()-this._callStartTime)/1e3):0;this._callStartTime=null;const s=String(Math.floor(e/60)).padStart(2,"0"),a=String(e%60).padStart(2,"0");this._emit({type:"ENDED",duration:e,displayDuration:`${s}:${a}`})}isActive(){return this._callActive}getElapsed(){return!this._callActive||!this._callStartTime?0:Math.floor((Date.now()-this._callStartTime)/1e3)}}const U=new ge,t={currentView:"dashboard",sidebarOpen:!1,checklistOpen:!1,modalOpen:!1,settingsOpen:!1,summaryModal:!1,expandedNotes:new Set,callSummary:null,gabrielEvents:[],gabrielInput:"",gabrielThinking:!1,gabrielAnalyzing:!1,micStatus:h.IDLE,liveTranscript:"",gabrielPaneOpen:!0,showTranscript:!1,transcriptLog:[],spanishMode:!1,spanishTranslatedCustomer:"",spanishAgentInput:"",spanishTranslatedAgent:"",spanishTranslating:!1,availableMicDevices:[],callType:"inbound",activeLead:null,coldCallPhase:"opener",gvCallActive:!1,gvCallTimer:"00:00",outcomeModalOpen:!1,outcomeNotes:"",capturedFields:{},leads:[],leadsFilter:"all",leadsSearch:"",leadsLoaded:!1,leadsStats:null,leadsImporting:!1},ye=50,ve=6,fe=4e3;let ae=0;function be(i){return!(!i||!i.trim()||i.trim().split(/\s+/).length<ve||Date.now()-ae<fe)}async function we(i,e){if(!be(i))return;ae=Date.now(),t.gabrielAnalyzing=!0;const s=document.getElementById("gabriel-analyzing-indicator");s&&(s.style.display="flex");try{t.callType==="outbound"&&t.activeLead?await f.analyzeColdCall(i,t.activeLead):await f.analyzeTranscript(i,e)}finally{t.gabrielAnalyzing=!1;const a=document.getElementById("gabriel-analyzing-indicator");a&&(a.style.display="none")}}function j(){const i=v.getState();return{customerName:i.callContext.customerName,lineOfBusiness:i.callContext.lineOfBusiness,stage:i.callContext.stage,triggers:[...i.callContext.triggers||[]],activeDisclosures:i.activeDisclosures,completedDisclosures:i.completedDisclosures}}f.subscribe(i=>{if(i.type==="THINKING"){t.gabrielThinking=!0,d();return}if(t.gabrielThinking=!1,i.type==="ERROR"){G({type:"ERROR",message:i.message,timestamp:new Date().toISOString()}),d();return}(i.type===y.ANSWER||i.type===y.AUTO_FILL||i.type===y.TRIGGER||i.type===y.ALERT||i.type===y.TALK_TRACK||i.type===y.OBJECTION||i.type===y.CAPTURE||i.type===y.QUALIFY)&&(G(i),i.type===y.AUTO_FILL&&Ie(i),i.type===y.CAPTURE&&i.field&&i.value&&(t.capturedFields[i.field]=i.value),d())});U.subscribe(i=>{if(i.type==="LAUNCHED"){t.gvCallActive=!0,t.gvCallTimer="00:00",t.micStatus===h.IDLE&&I.start(),d();return}if(i.type==="TIMER"){t.gvCallTimer=i.display;const e=document.getElementById("gv-call-timer");e&&(e.textContent=i.display);return}if(i.type==="ENDED"){t.gvCallActive=!1,t.gvCallTimer="00:00",d();return}});I.subscribe(i=>{if(i.type==="STATUS_CHANGE"){t.micStatus=i.status,d();return}if(i.type==="TRANSCRIPT_INTERIM"){t.liveTranscript=i.text;const e=document.getElementById("gabriel-live-transcript");e&&(e.textContent=i.text);return}if(i.type==="TRANSCRIPT_FINAL"){if(t.liveTranscript="",t.transcriptLog.push({text:i.text,speaker:i.speaker,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),ke(t.transcriptLog[t.transcriptLog.length-1]),t.spanishMode)f.translateToEnglish(i.text).then(e=>{if(e){t.spanishTranslatedCustomer=e;const s=document.getElementById("spanish-customer-text");s&&(s.textContent=e)}});else{const e=j();we(i.fullBuffer,e)}return}if(i.type==="ERROR"){G({type:"ERROR",message:i.message,timestamp:new Date().toISOString()}),d();return}});function G(i){t.gabrielEvents.unshift(i),t.gabrielEvents.length>ye&&t.gabrielEvents.pop()}function Ie(i){i.field==="customerName"&&i.value&&v.updateCustomerName(i.value);const e=document.getElementById(`autofill-${i.field}`);e&&(e.value=i.value||"",e.classList.add("autofilled"),setTimeout(()=>e.classList.remove("autofilled"),2e3))}function d(){const i=document.getElementById("app");i.innerHTML=`
    ${Ee()}
    <div class="main-content">
      ${Se()}
      <div class="workspace">
        ${t.currentView==="dashboard"?Ae():""}
        ${t.currentView==="call"?Ce():""}
        ${t.currentView==="library"?xe():""}
        ${t.currentView==="leads"?Ne():""}
      </div>
    </div>
    ${Pe()}
    ${Be()}
    ${Me()}
    ${De()}
  `,qe()}function Ee(){const i=v.getState(),e=i.activeDisclosures.length,s=i.callContext.stage!=="idle",a=t.micStatus===h.LISTENING;return`
    <aside class="sidebar ${t.sidebarOpen?"mobile-open":""}" id="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">👼</div>
        <div class="sidebar-brand-text">
          <h1>Gabriel</h1>
          <span>Agent Copilot</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a class="sidebar-nav-item ${t.currentView==="dashboard"?"active":""}" data-view="dashboard">
          <span class="nav-icon">🏠</span>
          Dashboard
        </a>
        <a class="sidebar-nav-item ${t.currentView==="call"?"active":""}" data-view="call">
          <span class="nav-icon">📞</span>
          Active Call
          ${e>0?`<span class="nav-badge">${e}</span>`:""}
        </a>
        <a class="sidebar-nav-item ${t.currentView==="leads"?"active":""}" data-view="leads">
          <span class="nav-icon">🎯</span>
          Leads
          ${t.leadsStats&&t.leadsStats.new>0?`<span class="nav-badge leads-badge">${t.leadsStats.new}</span>`:""}
        </a>
        <a class="sidebar-nav-item ${t.currentView==="library"?"active":""}" data-view="library">
          <span class="nav-icon">📚</span>
          Disclosure Library
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-status-row">
          <span class="status-dot ${a?"mic-active":""}"></span>
          ${s?`On Call — ${i.callContext.customerName||"Customer"}`:"Ready"}
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top: 8px;">
          <span style="opacity: 0.5; font-size: 0.65rem;">TX Personal Auto • v2.0</span>
          <button class="settings-btn" id="settings-trigger" title="Settings">⚙️</button>
        </div>
      </div>
    </aside>
  `}function Se(){const i=v.getState(),e=["intake","drivers","vehicles","coverage","disclosures","review"],s=i.callContext.stage,a=s!=="idle";return`
    <div class="top-bar">
      <button class="mobile-menu-btn" id="mobile-menu-btn">☰</button>
      <span class="top-bar-title">
        ${t.currentView==="dashboard"?"Dashboard":""}
        ${t.currentView==="call"?a?`📞 ${i.callContext.customerName||"Active Call"}`:"Active Call":""}
        ${t.currentView==="library"?"Disclosure Library":""}
      </span>
      ${a&&t.currentView==="call"?`
        <div class="top-bar-stage">
          ${e.map(n=>`
            <span class="stage-pill ${n===s?"active":e.indexOf(n)<e.indexOf(s)?"completed":"inactive"}" 
                  data-stage="${n}">
              ${n===s?"●":e.indexOf(n)<e.indexOf(s)?"✓":""} ${n}
            </span>
          `).join("")}
        </div>
        <button class="checklist-toggle" id="checklist-toggle">📋</button>
      `:""}
    </div>
  `}function Ae(){const i=v.getState(),e=i.callContext.stage!=="idle",s=f.hasApiKey(),a=I.hasApiKey();return e?`
      <div class="welcome-screen">
        <div class="welcome-icon">📞</div>
        <h2>Call in Progress</h2>
        <p>You have an active call with <strong>${i.callContext.customerName||"a customer"}</strong>. Switch to the Active Call view to manage disclosures.</p>
        <button class="start-call-btn" data-view="call">Go to Active Call →</button>
      </div>
    `:`
    <div class="welcome-screen">
      <div class="welcome-icon">👼</div>
      <h2>Gabriel</h2>
      <p>Your real-time AI compliance copilot. Gabriel listens to your calls, helps you navigate any situation, and ensures every required disclosure is delivered — so nothing ever gets missed.</p>
      
      ${!s||!a?`
        <div class="setup-notice">
          <div class="setup-notice-title">⚙️ Setup Required</div>
          <div class="setup-notice-items">
            ${s?'<div class="setup-item ok">✅ Gemini connected</div>':'<div class="setup-item missing">❌ Gemini API key not configured</div>'}
            ${a?'<div class="setup-item ok">✅ Deepgram connected</div>':'<div class="setup-item missing">❌ Deepgram API key not configured</div>'}
          </div>
          <button class="btn-settings-open" id="start-settings-trigger">⚙️ Open Settings</button>
        </div>
      `:`
        <div class="setup-notice all-good">
          <div class="setup-item ok">✅ Gemini connected</div>
          <div class="setup-item ok">✅ Deepgram connected</div>
        </div>
      `}

      <button class="start-call-btn" id="start-call-trigger" style="margin-top: 24px;">
        📞 Start New Call
      </button>
    </div>
  `}function Ce(){const i=v.getState();if(!(i.callContext.stage!=="idle"))return`
      <div class="welcome-screen">
        <div class="welcome-icon">📞</div>
        <h2>No Active Call</h2>
        <p>Start a call to begin real-time compliance tracking with Gabriel.</p>
        <button class="start-call-btn" id="start-call-trigger">
          📞 Start New Call
        </button>
      </div>
    `;const s=v.getAvailableTriggers(),{activeDisclosures:a,completedDisclosures:n,stats:o}=i;return`
    <!-- Hidden autofill DOM anchors for speech auto-fill -->
    <input type="hidden" id="autofill-customerName" />
    <input type="hidden" id="autofill-vin" />
    <input type="hidden" id="autofill-vehicleYear" />
    <input type="hidden" id="autofill-vehicleMake" />
    <input type="hidden" id="autofill-vehicleModel" />
    <input type="hidden" id="autofill-policyType" />
    <div class="call-workspace-v2">
      <!-- Left: Disclosures Column -->
      <div class="disclosures-column">
        <div class="triggers-section">
          <div class="section-title">⚡ Quick Actions</div>
          <div class="trigger-grid">
            ${s.filter(l=>l.key!=="start_application").map(l=>`
                <button class="trigger-btn ${l.used?"used":""}" 
                        data-trigger="${l.key}" 
                        ${l.used?"disabled":""}>
                  ${l.label}
                </button>
              `).join("")}
          </div>
        </div>

        <div class="section-title">
          📋 Active Disclosures 
          ${a.length>0?`<span class="text-accent">(${a.length})</span>`:""}
        </div>
        
        <div class="disclosures-area">
          ${a.length===0?`<div class="empty-disclosures">
                <div class="empty-icon">✨</div>
                <p>No active disclosures right now.<br>Use the Quick Actions above to trigger disclosures as the call progresses.</p>
               </div>`:a.map(l=>Oe(l)).join("")}
        </div>
      </div>

      <!-- Center: Gabriel AI Pane -->
      <div class="gabriel-pane ${t.gabrielPaneOpen?"":"gabriel-pane-collapsed"}" id="gabriel-pane">
        <!-- Mobile collapse tab -->
        <button class="gabriel-collapse-tab" id="gabriel-collapse-tab" title="${t.gabrielPaneOpen?"Collapse Gabriel":"Expand Gabriel"}">
          ${t.gabrielPaneOpen?"◀":"▶"} <span class="gabriel-collapse-label">Gabriel</span>
        </button>
        ${t.gabrielPaneOpen?t.callType==="outbound"?Le():Te():""}
      </div>

      <!-- Right: Checklist -->
      <div class="checklist-panel ${t.checklistOpen?"mobile-open":""}" id="checklist-panel">
        ${$e(a,n,o)}
      </div>
    </div>
  `}function Te(){const i=t.micStatus===h.LISTENING,e=t.micStatus===h.CONNECTING,s=t.micStatus===h.ERROR,a={[h.IDLE]:"Ready",[h.CONNECTING]:"Connecting…",[h.LISTENING]:"Listening",[h.PAUSED]:"Paused",[h.ERROR]:"Error"}[t.micStatus]||"Ready";return`
    <div class="gabriel-pane-header">
      <div class="gabriel-pane-title">
        <span>🤖 Gabriel</span>
        <div class="gabriel-status ${i?"status-listening":s?"status-error":e?"status-connecting":"status-idle"}">
          <span class="gabriel-status-dot"></span>
          ${a}
        </div>
      </div>
      <div class="gabriel-pane-actions">
        <button class="gabriel-tool-btn ${t.showTranscript?"active":""}" id="transcript-toggle"
                title="${t.showTranscript?"Hide Transcript":"Show Transcript"}">
          📄 Transcript
        </button>
        <button class="gabriel-tool-btn ${t.spanishMode?"active spanish-active":""}" id="spanish-toggle"
                title="${t.spanishMode?"Disable Spanish Mode":"Enable Spanish Translator"}">
          🌐 Español
        </button>
        <div class="mic-toggle-wrap">
          <button class="mic-toggle-btn ${i?"active":""}" id="mic-toggle" 
                  title="${i?"Stop Listening":"Start Listening"}">
            ${e?"⏳":i?"🔴":"🎙️"}
            ${e?"Connecting":i?"Stop":"Listen"}
          </button>
          ${I.getDeviceId()?(()=>{const o=t.availableMicDevices.find(g=>g.deviceId===I.getDeviceId()),l=o?o.label:"Custom device",p=l.length>22?l.slice(0,20)+"…":l;return`<div class="mic-device-label" title="${u(l)}">📡 ${u(p)}</div>`})():""}
        </div>
      </div>
    </div>

    <!-- Live interim transcript ticker -->
    ${i?`
      <div class="gabriel-transcript-bar">
        <span id="gabriel-live-transcript" class="gabriel-transcript-text">${t.liveTranscript||"…listening…"}</span>
      </div>
    `:""}

    <!-- Transcript Log Panel -->
    ${t.showTranscript?_e():""}

    <!-- Spanish Translator Panel -->
    ${t.spanishMode?Re():""}

    <!-- Event feed (hidden in Spanish-only mode when there are no events) -->
    ${t.spanishMode?"":`
      <div class="gabriel-feed" id="gabriel-feed">
        ${t.gabrielThinking?`
          <div class="gabriel-event gabriel-thinking">
            <div class="gabriel-thinking-dots"><span></span><span></span><span></span></div>
            <span>Gabriel is thinking…</span>
          </div>
        `:""}
        <div class="gabriel-analyzing-indicator" id="gabriel-analyzing-indicator"
             style="display: ${t.gabrielAnalyzing?"flex":"none"}">
          <span class="gabriel-analyzing-dot"></span>
          <span>Analyzing speech…</span>
        </div>
        ${t.gabrielEvents.length===0&&!t.gabrielThinking?`
          <div class="gabriel-empty">
            <p>Gabriel is watching.<br>Ask a question below or start listening to hear the call.</p>
          </div>
        `:""}
        ${t.gabrielEvents.map((o,l)=>ne(o,l)).join("")}
      </div>
    `}

    <!-- Manual Q&A input -->
    <div class="gabriel-input-bar">
      <input type="text" 
             id="gabriel-question-input"
             class="gabriel-input"
             placeholder="Ask Gabriel anything… (e.g. What if they have a DUI?)"
             value="${u(t.gabrielInput)}"
             autocomplete="off" />
      <button class="gabriel-send-btn" id="gabriel-send" 
              ${f.hasApiKey()?"":'disabled title="Configure Gemini API key in Settings"'}>
        ${t.gabrielThinking?"⏳":"→"}
      </button>
    </div>
  `}function _e(){return`
    <div class="transcript-panel" id="transcript-panel">
      <div class="transcript-panel-header">
        <span>📄 Live Transcript</span>
        ${t.transcriptLog.length>0?'<button class="transcript-clear-btn" id="transcript-clear">Clear</button>':""}
      </div>
      <div class="transcript-entries" id="transcript-entries">
        ${t.transcriptLog.length===0?'<div class="transcript-empty">Transcript will appear here when the mic is listening.</div>':t.transcriptLog.map(i=>ie(i)).join("")}
      </div>
    </div>
  `}function ie(i){const e=i.speaker==="Agent"?"transcript-entry-agent":i.speaker==="Customer"?"transcript-entry-customer":"transcript-entry-unknown",s=i.speaker||"🎙️";return`<div class="transcript-entry ${e}">
    <span class="transcript-speaker">${u(s)}</span>
    <span class="transcript-text">${u(i.text)}</span>
    <span class="transcript-time">${u(i.time)}</span>
  </div>`}function ke(i){const e=document.getElementById("transcript-entries");if(!e)return;const s=e.querySelector(".transcript-empty");s&&s.remove();const a=document.createElement("div");a.innerHTML=ie(i),e.appendChild(a.firstElementChild),e.scrollTop=e.scrollHeight}function Re(){return`
    <div class="spanish-panel">
      <div class="spanish-section">
        <div class="spanish-section-label">🇲🇽 They Said <span class="spanish-label-sub">(translated to English)</span></div>
        <div class="spanish-customer-box" id="spanish-customer-text">
          ${u(t.spanishTranslatedCustomer)||`<span class="spanish-placeholder">Customer's Spanish will appear here in English…</span>`}
        </div>
      </div>
      <div class="spanish-section">
        <div class="spanish-section-label">💬 Your Response <span class="spanish-label-sub">(type in English)</span></div>
        <div class="spanish-input-row">
          <input type="text"
                 id="spanish-agent-input"
                 class="spanish-input"
                 placeholder="Type your English reply here…"
                 value="${u(t.spanishAgentInput)}"
                 autocomplete="off" />
          <button class="spanish-translate-btn" id="spanish-translate"
                  ${f.hasApiKey()?"":'disabled title="Configure Gemini API key in Settings"'}>
            ${t.spanishTranslating?"⏳":"Translate →"}
          </button>
        </div>
        ${t.spanishTranslatedAgent?`
          <div class="spanish-speak-box">
            <div class="spanish-speak-label">🗣️ Speak This (Spanish)</div>
            <div class="spanish-speak-text">${u(t.spanishTranslatedAgent)}</div>
          </div>
        `:""}
      </div>
    </div>
  `}function ne(i,e){const a={[y.AUTO_FILL]:{icon:"✏️",cls:"ev-autofill",label:"Auto-Fill"},[y.TRIGGER]:{icon:"⚡",cls:"ev-trigger",label:"Trigger"},[y.ALERT]:{icon:"🚨",cls:"ev-alert",label:"Alert"},[y.ANSWER]:{icon:"💬",cls:"ev-answer",label:"Answer"},[y.TALK_TRACK]:{icon:"🗣️",cls:"ev-talktrack",label:"Talk Track"},[y.OBJECTION]:{icon:"🛡️",cls:"ev-objection",label:"Objection"},[y.CAPTURE]:{icon:"📌",cls:"ev-capture",label:"Captured"},[y.QUALIFY]:{icon:"🔍",cls:"ev-qualify",label:"Qualify"},ERROR:{icon:"❌",cls:"ev-error",label:"Error"},USER_QUESTION:{icon:"🧑",cls:"ev-user",label:"You asked"}}[i.type]||{icon:"•",cls:"ev-answer",label:i.type},n=i.timestamp?new Date(i.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";let o="";i.type===y.AUTO_FILL?(o=`<strong>${i.field}:</strong> ${u(i.value||"")}`,i.message&&(o+=`<br><span class="ev-sub">${u(i.message)}</span>`)):i.type===y.TRIGGER?(o=u(i.message||i.triggerKey||""),i.triggerKey&&(o+=`<button class="gabriel-confirm-trigger" data-trigger="${i.triggerKey}">⚡ Confirm</button>`)):o=u(i.message||"").replace(/\n/g,"<br>");const l=i.source==="speech"?`🎙️ ${i.speaker?u(i.speaker):"heard"}`:null;return`
    <div class="gabriel-event ${a.cls} ${e===0&&!t.gabrielThinking?"gabriel-event-new":""}" data-ev-idx="${e}">
      <div class="gabriel-event-header">
        <span class="gabriel-event-type">${a.icon} ${a.label}</span>
        ${l?`<span class="gabriel-event-badge">${l}</span>`:""}
        <span class="gabriel-event-time">${n}</span>
      </div>
      <div class="gabriel-event-body">${o}</div>
    </div>
  `}function Oe(i){const e=t.expandedNotes.has(i.id);return`
    <div class="disclosure-card severity-${i.severity}" id="card-${i.id}">
      <div class="disclosure-card-header">
        <div>
          <div class="disclosure-card-title">${i.name}</div>
          <div class="disclosure-statute">${i.statute}</div>
        </div>
        <div class="disclosure-card-badges">
          ${i.severity==="critical"?'<span class="badge badge-critical">Critical</span>':""}
          ${i.required?'<span class="badge badge-required">Required</span>':'<span class="badge badge-recommended">Recommended</span>'}
          ${i.formRequired?'<span class="badge badge-form">Form Required</span>':""}
        </div>
      </div>

      <div class="disclosure-text">
        <button class="copy-btn" data-copy="${i.id}">📋 Copy</button>
        ${i.disclosureText}
      </div>

      <div class="agent-notes">
        <button class="agent-notes-toggle" data-notes-toggle="${i.id}">
          <span class="arrow ${e?"expanded":""}">▶</span>
          Agent Notes
        </button>
        <div class="agent-notes-content ${e?"expanded":""}">
          ${i.agentNotes}
        </div>
      </div>

      ${i.formRequired?`
        <div class="form-notice">
          📄 <strong>${i.formName}</strong>
        </div>
      `:""}

      <div class="disclosure-card-actions">
        <button class="mark-complete-btn" data-complete="${i.id}">
          ✓ Mark as Presented
        </button>
      </div>
    </div>
  `}function $e(i,e,s){const a=[...e.map(n=>({...n,done:!0})),...i.map(n=>({...n,done:!1}))];return a.sort((n,o)=>n.order-o.order),`
    <div class="checklist-header">
      <h3>📋 Checklist</h3>
      <span class="checklist-percentage">${s.percentage}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: ${s.percentage}%"></div>
    </div>
    <div class="checklist-items">
      ${a.map(n=>`
        <div class="checklist-item ${n.done?"completed":"pending"}" data-checklist-id="${n.id}" data-done="${n.done}">
          <span class="check-icon">${n.done?"✓":""}</span>
          <span class="check-label">${n.name}</span>
          <span class="severity-indicator ${n.severity}"></span>
        </div>
      `).join("")}
      ${a.length===0?'<p class="text-muted" style="font-size:0.82rem; text-align:center; padding: 16px;">Disclosures will appear here as they are triggered.</p>':""}
    </div>
    <div class="call-summary-section">
      <div style="font-size:0.75rem; color: var(--text-muted); margin-bottom: 8px;">
        ${s.requiredRemaining>0?`⚠️ ${s.requiredRemaining} required disclosure${s.requiredRemaining>1?"s":""} remaining`:s.total>0?"✅ All required disclosures completed":""}
      </div>
      <button class="end-call-btn" id="end-call-btn">End Call & Review</button>
    </div>
  `}function xe(){return`
    <div class="section-title" style="margin-bottom: 8px;">All TX Personal Auto Disclosures</div>
    <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 24px;">Complete reference library of all required and recommended disclosures for Texas personal auto insurance.</p>
    <div class="library-grid">
      ${v.getState().allDisclosures.map(e=>`
        <div class="library-card severity-${e.severity}">
          <div class="disclosure-card-header" style="margin-bottom: 8px;">
            <div class="disclosure-card-title" style="font-size: 0.95rem;">${e.name}</div>
            <div class="disclosure-card-badges">
              ${e.severity==="critical"?'<span class="badge badge-critical">Critical</span>':""}
              ${e.required?'<span class="badge badge-required">Required</span>':'<span class="badge badge-recommended">Rec.</span>'}
              ${e.formRequired?'<span class="badge badge-form">Form</span>':""}
            </div>
          </div>
          <div class="disclosure-statute">${e.statute}</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">
            ${e.disclosureText.substring(0,180)}…
          </p>
        </div>
      `).join("")}
    </div>
  `}function Ne(){const i=t.leads.filter(a=>{const n=t.leadsFilter==="all"||a.status===t.leadsFilter,o=t.leadsSearch.toLowerCase(),l=!o||a.name.toLowerCase().includes(o)||(a.phone||"").includes(o)||(a.city||"").toLowerCase().includes(o)||(a.category||"").toLowerCase().includes(o);return n&&l}),e=a=>{const o={new:{label:"New",cls:"badge-new"},called:{label:"Called",cls:"badge-called"},interested:{label:"Interested",cls:"badge-interested"},callback:{label:"Callback",cls:"badge-callback"},not_interested:{label:"Not Interested",cls:"badge-cold"},no_answer:{label:"No Answer",cls:"badge-no-answer"},closed:{label:"Closed",cls:"badge-closed"}}[a]||{label:a,cls:""};return`<span class="lead-status-badge ${o.cls}">${o.label}</span>`},s=t.leadsStats;return`
    <div class="leads-view">
      <div class="leads-header">
        <div class="leads-header-title">
          <h2>🎯 Lead Database</h2>
          <span class="leads-count">${t.leads.length} total leads</span>
        </div>
        <div class="leads-header-actions">
          <label class="import-csv-btn" for="csv-import-input">
            ${t.leadsImporting?"⏳ Importing…":"📂 Import CSV"}
          </label>
          <input type="file" id="csv-import-input" accept=".csv" style="display:none;" />
        </div>
      </div>

      ${s?`
        <div class="leads-stats-bar">
          <div class="lead-stat" data-filter="all" data-active="${t.leadsFilter==="all"}">
            <span class="lead-stat-num">${s.total}</span>
            <span class="lead-stat-label">All</span>
          </div>
          <div class="lead-stat" data-filter="new" data-active="${t.leadsFilter==="new"}">
            <span class="lead-stat-num">${s.new}</span>
            <span class="lead-stat-label">New</span>
          </div>
          <div class="lead-stat" data-filter="interested" data-active="${t.leadsFilter==="interested"}">
            <span class="lead-stat-num">${s.interested}</span>
            <span class="lead-stat-label">Interested</span>
          </div>
          <div class="lead-stat" data-filter="callback" data-active="${t.leadsFilter==="callback"}">
            <span class="lead-stat-num">${s.callback}</span>
            <span class="lead-stat-label">Callback</span>
          </div>
          <div class="lead-stat" data-filter="not_interested" data-active="${t.leadsFilter==="not_interested"}">
            <span class="lead-stat-num">${s.not_interested}</span>
            <span class="lead-stat-label">Not Interested</span>
          </div>
          <div class="lead-stat" data-filter="no_answer" data-active="${t.leadsFilter==="no_answer"}">
            <span class="lead-stat-num">${s.no_answer}</span>
            <span class="lead-stat-label">No Answer</span>
          </div>
        </div>
      `:""}

      <div class="leads-search-bar">
        <input type="text" 
               id="leads-search" 
               class="leads-search-input"
               placeholder="🔍 Search by name, phone, city, or category…"
               value="${u(t.leadsSearch)}" />
      </div>

      ${t.leads.length===0&&!t.leadsImporting?`
        <div class="leads-empty">
          <div class="leads-empty-icon">🎯</div>
          <h3>No Leads Yet</h3>
          <p>Import a CSV from your lead scraper to get started, or add leads manually.</p>
          <label class="import-csv-btn-large" for="csv-import-input">📂 Import CSV File</label>
          <input type="file" id="csv-import-input" accept=".csv" style="display:none;" />
        </div>
      `:i.length===0?`
        <div class="leads-empty">
          <p>No leads match your search or filter.</p>
        </div>
      `:`
        <div class="leads-grid">
          ${i.map(a=>`
            <div class="lead-card" data-lead-id="${a.id}">
              <div class="lead-card-header">
                <div class="lead-card-name">${u(a.name)}</div>
                ${e(a.status)}
              </div>
              <div class="lead-card-meta">
                ${a.phone?`<span>📞 ${u(a.phone)}</span>`:""}
                ${a.city?`<span>📍 ${u([a.city,a.state].filter(Boolean).join(", "))}</span>`:""}
              </div>
              <div class="lead-card-category">${u(a.category||"")}</div>
              ${a.notes?`<div class="lead-card-notes">${u(a.notes.substring(0,80))}${a.notes.length>80?"…":""}</div>`:""}
              ${Object.keys(a.capturedData||{}).length>0?`
                <div class="lead-card-captured">
                  ${Object.entries(a.capturedData).map(([n,o])=>`<span class="capture-chip">📌 ${u(n)}: ${u(String(o))}</span>`).join("")}
                </div>
              `:""}
              <div class="lead-card-footer">
                ${a.lastCalled?`<span class="lead-last-called">Last called: ${new Date(a.lastCalled).toLocaleDateString()}</span>`:'<span class="lead-last-called">Never called</span>'}
                <button class="lead-call-btn" data-call-lead="${a.id}">📞 Call Now</button>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `}function Le(){const i=t.micStatus===h.LISTENING,e=t.micStatus===h.CONNECTING,s=t.micStatus===h.ERROR,a=t.activeLead,n=["opener","qualify","pitch","close"],o={opener:"👋 Opener",qualify:"🔍 Qualify",pitch:"💬 Pitch",close:"🎯 Close"},l={[h.IDLE]:"Ready",[h.CONNECTING]:"Connecting…",[h.LISTENING]:"Listening",[h.PAUSED]:"Paused",[h.ERROR]:"Error"}[t.micStatus]||"Ready";return`
    <div class="gabriel-pane-header">
      <div class="gabriel-pane-title">
        <span>🤖 Gabriel — Outbound</span>
        <div class="gabriel-status ${i?"status-listening":s?"status-error":e?"status-connecting":"status-idle"}">
          <span class="gabriel-status-dot"></span>
          ${l}
        </div>
      </div>
      <div class="gabriel-pane-actions">
        <div class="mic-toggle-wrap">
          <button class="mic-toggle-btn ${i?"active":""}" id="mic-toggle"
                  title="${i?"Stop Listening":"Start Listening"}">
            ${e?"⏳":i?"🔴":"🎤"}
            ${e?"Connecting":i?"Stop":"Listen"}
          </button>
        </div>
      </div>
    </div>

    <!-- Lead Info Strip -->
    ${a?`
      <div class="cold-call-lead-strip">
        <div class="cold-call-lead-name">${u(a.name)}</div>
        <div class="cold-call-lead-meta">
          <span>📞 ${u(a.phone||"No phone")}</span>
          <span>💼 ${u(a.category||"")}</span>
          <span>📍 ${u([a.city,a.state].filter(Boolean).join(", ")||"")}</span>
          ${(a.callCount||0)>0?`<span>🔄 Call #${a.callCount+1}</span>`:"<span>✨ First call!</span>"}
        </div>
        <!-- Google Voice dial button -->
        <div class="gv-dial-row">
          ${t.gvCallActive?`
            <div class="gv-call-active">
              <span class="gv-call-dot"></span>
              <span class="gv-call-label">Call in Progress</span>
              <span class="gv-call-timer" id="gv-call-timer">${t.gvCallTimer}</span>
              <button class="gv-end-btn" id="gv-end-btn">End Call</button>
            </div>
          `:`
            <button class="gv-call-btn" id="gv-call-btn"
                    data-phone="${u(a.phone||"")}"
                    ${a.phone?"":'disabled title="No phone number for this lead"'}>
              📞 Call with Google Voice
            </button>
          `}
        </div>
      </div>
    `:""}

    <!-- Call Phase Tracker -->
    <div class="cold-call-phases">
      ${n.map(g=>`
        <button class="cold-call-phase ${t.coldCallPhase===g?"active":""}" data-phase="${g}">
          ${o[g]}
        </button>
      `).join("")}
    </div>

    <!-- Live transcript ticker -->
    ${i?`
      <div class="gabriel-transcript-bar">
        <span id="gabriel-live-transcript" class="gabriel-transcript-text">${t.liveTranscript||"…listening…"}</span>
      </div>
    `:""}

    <!-- Captured Data Chips -->
    ${Object.keys(t.capturedFields).length>0?`
      <div class="cold-call-captures">
        <div class="captures-label">📌 Captured Info</div>
        ${Object.entries(t.capturedFields).map(([g,b])=>`<span class="capture-chip">${u(g)}: <strong>${u(String(b))}</strong></span>`).join("")}
      </div>
    `:""}

    <!-- Gabriel AI Event Feed -->
    <div class="gabriel-feed" id="gabriel-feed">
      ${t.gabrielThinking?`
        <div class="gabriel-event gabriel-thinking">
          <div class="gabriel-thinking-dots"><span></span><span></span><span></span></div>
          <span>Gabriel is thinking…</span>
        </div>
      `:""}
      <div class="gabriel-analyzing-indicator" id="gabriel-analyzing-indicator"
           style="display: ${t.gabrielAnalyzing?"flex":"none"}">
        <span class="gabriel-analyzing-dot"></span>
        <span>Analyzing speech…</span>
      </div>
      ${t.gabrielEvents.length===0&&!t.gabrielThinking?`
        <div class="gabriel-empty">
          <p>Gabriel is ready.<br>Start the mic to get real-time coaching, or ask a question below.</p>
        </div>
      `:""}
      ${t.gabrielEvents.map((g,b)=>ne(g,b)).join("")}
    </div>

    <!-- Manual Q&A input -->
    <div class="gabriel-input-bar">
      <input type="text"
             id="gabriel-question-input"
             class="gabriel-input"
             placeholder="Ask Gabriel anything… (e.g. What's our AI Receptionist price?)"
             value="${u(t.gabrielInput)}"
             autocomplete="off" />
      <button class="gabriel-send-btn" id="gabriel-send"
              ${f.hasApiKey()?"":'disabled title="Configure Gemini API key in Settings"'}>
        ${t.gabrielThinking?"⏳":"→"}
      </button>
    </div>
  `}function De(){if(!t.outcomeModalOpen)return"";const i=t.activeLead,e=Object.keys(t.capturedFields).length>0?`
Captured:
`+Object.entries(t.capturedFields).map(([s,a])=>`- ${s}: ${a}`).join(`
`):"";return`
    <div class="modal-overlay visible" id="outcome-overlay">
      <div class="modal outcome-modal">
        <h3>📋 Log Call Outcome</h3>
        ${i?`<div class="outcome-lead-name">${u(i.name)}</div>`:""}

        <div class="outcome-buttons">
          <button class="outcome-btn outcome-interested"  data-outcome="interested" >🎯 Interested</button>
          <button class="outcome-btn outcome-callback"    data-outcome="callback"   >📅 Callback</button>
          <button class="outcome-btn outcome-no-answer"   data-outcome="no_answer"  >📵 No Answer</button>
          <button class="outcome-btn outcome-not-int"     data-outcome="not_interested">❌ Not Interested</button>
        </div>

        <div class="modal-field">
          <label>Notes</label>
          <textarea id="outcome-notes" rows="4" placeholder="Add notes about the call…">${u(t.outcomeNotes||e)}</textarea>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" id="outcome-cancel">Cancel</button>
          <button class="btn-primary"   id="outcome-save">Save &amp; Continue →</button>
        </div>
      </div>
    </div>
  `}function Pe(){const i=t.callType==="outbound",e=t.leads.filter(s=>s.status==="new"||s.status==="callback");return`
    <div class="modal-overlay ${t.modalOpen?"visible":""}" id="modal-overlay">
      <div class="modal">
        <h3>Start New Call</h3>

        <!-- Call type toggle -->
        <div class="call-type-toggle">
          <button class="call-type-btn ${i?"":"active"}" data-call-type="inbound">
            📞 Inbound
          </button>
          <button class="call-type-btn ${i?"active":""}" data-call-type="outbound">
            📤 Outbound (Cold Call)
          </button>
        </div>

        ${i?`
          <!-- Outbound fields -->
          <div class="modal-field">
            <label>Select Lead</label>
            ${e.length>0?`
              <select id="lead-select">
                <option value="">-- Quick Dial (no lead) --</option>
                ${e.map(s=>`
                  <option value="${s.id}">${u(s.name)} — ${u(s.phone||"no phone")} (${s.status})</option>
                `).join("")}
              </select>
            `:'<div style="color: var(--text-muted); font-size: 0.85rem;">No new leads in database. <a data-view="leads" style="cursor:pointer; color: var(--accent);">Import leads first →</a></div>'}
          </div>
          <div class="modal-field">
            <label>Or Quick Dial (name &amp; phone)</label>
            <input type="text" id="customer-name" placeholder="Business name" autocomplete="off" style="margin-bottom: 6px;"/>
            <input type="text" id="quick-dial-phone" placeholder="Phone number" autocomplete="off" />
          </div>
        `:`
          <!-- Inbound fields -->
          <div class="modal-field">
            <label>Customer Name</label>
            <input type="text" id="customer-name" placeholder="e.g. John Smith" autocomplete="off" />
          </div>
          <div class="modal-field">
            <label>Line of Business</label>
            <select id="lob-select">
              <option value="personal_auto">🚗 Personal Auto</option>
              <option value="homeowners" disabled>🏠 Homeowners (Coming Soon)</option>
              <option value="medicare"   disabled>🏥 Medicare (Coming Soon)</option>
              <option value="life"       disabled>💀 Life Insurance (Coming Soon)</option>
            </select>
          </div>
        `}

        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-primary" id="modal-start">Start Call →</button>
        </div>
      </div>
    </div>
  `}function Me(){const i=f.getApiKey(),e=I.getApiKey();return`
    <div class="modal-overlay ${t.settingsOpen?"visible":""}" id="settings-overlay">
      <div class="modal" style="max-width: 480px;">
        <h3>⚙️ Gabriel Settings</h3>
        
        <div class="modal-field">
          <label>Gemini API Key <span style="color: var(--status-critical);">*</span></label>
          <input type="password" id="settings-gemini-key" 
                 placeholder="AIza…" 
                 value="${u(i)}"
                 autocomplete="off" />
          <div class="settings-hint">Powers Gabriel's AI brain. Get one free at <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a></div>
        </div>

        <div class="modal-field">
          <label>Deepgram API Key <span style="color: var(--status-critical);">*</span></label>
          <input type="password" id="settings-deepgram-key" 
                 placeholder="Your Deepgram key…"
                 value="${u(e)}"
                 autocomplete="off" />
          <div class="settings-hint">Powers real-time speech-to-text. Free tier: 12,000 min/month at <a href="https://deepgram.com" target="_blank">deepgram.com</a></div>
        </div>

        <div class="modal-field">
          <label>🎙️ Microphone Source</label>
          ${t.availableMicDevices.length>0?`
            <select id="settings-mic-device">
              <option value="" ${I.getDeviceId()?"":"selected"}>Default System Microphone</option>
              ${t.availableMicDevices.map(s=>`
                <option value="${u(s.deviceId)}" ${I.getDeviceId()===s.deviceId?"selected":""}>
                  ${u(s.label)}
                </option>
              `).join("")}
            </select>
            <div class="settings-hint">Select <strong>CABLE Output (VB-Audio Virtual Cable)</strong> to capture both sides of the call.</div>
          `:`
            <div style="display:flex; gap: 8px; align-items:center;">
              <select id="settings-mic-device" disabled style="flex:1;">
                <option>Click "Detect" to list microphones…</option>
              </select>
              <button class="btn-secondary" id="settings-detect-devices" style="white-space:nowrap; padding: 6px 12px;">🔍 Detect</button>
            </div>
            <div class="settings-hint">Allows selecting a virtual audio cable (VB-Cable) to hear both call sides.</div>
          `}
          ${t.availableMicDevices.length>0?`
            <button class="btn-secondary" id="settings-detect-devices" style="margin-top:6px; padding:4px 10px; font-size:0.78rem;">🔄 Refresh Devices</button>
          `:""}
        </div>

        <div class="settings-tip">
          <strong>💡 VB-Cable Tip:</strong> Install <a href="https://vb-audio.com/Cable/" target="_blank">VB-Cable</a> (free), route your phone audio → CABLE Input, then select <em>CABLE Output</em> above so Gabriel hears both sides.
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" id="settings-cancel">Cancel</button>
          <button class="btn-primary" id="settings-save">Save Settings</button>
        </div>
      </div>
    </div>
  `}function Be(){if(!t.summaryModal||!t.callSummary)return"";const{completed:i,total:e,missingRequired:s}=t.callSummary;return`
    <div class="modal-overlay visible" id="summary-overlay">
      <div class="modal" style="max-width: 500px;">
        <h3>📋 Call Summary</h3>
        <div class="summary-stats">
          <div class="summary-stat">
            <div class="stat-value">${i}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value">${e}</div>
            <div class="stat-label">Total Triggered</div>
          </div>
        </div>
        ${s.length>0?`
          <div class="summary-missing">
            <h4>⚠️ Missing Required Disclosures</h4>
            <ul>
              ${s.map(a=>`<li>${a.name} — ${a.statute}</li>`).join("")}
            </ul>
          </div>
        `:`
          <div style="background: var(--status-success-bg); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-md); padding: var(--space-md); text-align: center; margin-bottom: var(--space-md);">
            <span style="font-size: 1.5rem;">✅</span>
            <p style="color: var(--status-success); font-weight: 600; margin-top: 4px;">All required disclosures completed!</p>
          </div>
        `}
        <div class="modal-actions">
          <button class="btn-secondary" id="summary-back">← Back to Call</button>
          <button class="btn-primary" id="summary-confirm">Confirm & End Call</button>
        </div>
      </div>
    </div>
  `}function u(i){return String(i||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qe(){document.querySelectorAll("[data-view]").forEach(r=>{r.addEventListener("click",c=>{c.preventDefault(),t.currentView=r.dataset.view,t.sidebarOpen=!1,d()})});const i=document.getElementById("mobile-menu-btn");i&&i.addEventListener("click",()=>{t.sidebarOpen=!t.sidebarOpen,document.getElementById("sidebar").classList.toggle("mobile-open")});const e=document.getElementById("checklist-toggle");e&&e.addEventListener("click",()=>{var r;t.checklistOpen=!t.checklistOpen,(r=document.getElementById("checklist-panel"))==null||r.classList.toggle("mobile-open")}),document.querySelectorAll("#start-call-trigger").forEach(r=>{r.addEventListener("click",()=>{t.modalOpen=!0,d(),setTimeout(()=>{var c;return(c=document.getElementById("customer-name"))==null?void 0:c.focus()},100)})}),document.querySelectorAll("#settings-trigger, #start-settings-trigger").forEach(r=>{r==null||r.addEventListener("click",async()=>{t.settingsOpen=!0,d();try{await navigator.mediaDevices.getUserMedia({audio:!0}).then(m=>m.getTracks().forEach(w=>w.stop())).catch(()=>{});const c=await navigator.mediaDevices.enumerateDevices();t.availableMicDevices=c.filter(m=>m.kind==="audioinput").map(m=>({deviceId:m.deviceId,label:m.label||`Microphone (${m.deviceId.slice(0,8)}…)`})).filter(m=>m.deviceId&&m.deviceId!=="default"&&m.deviceId!=="communications"),d()}catch{}})});const s=document.getElementById("settings-save");s&&s.addEventListener("click",()=>{var w,T,C,x,D;const r=(T=(w=document.getElementById("settings-gemini-key"))==null?void 0:w.value)==null?void 0:T.trim(),c=(x=(C=document.getElementById("settings-deepgram-key"))==null?void 0:C.value)==null?void 0:x.trim(),m=((D=document.getElementById("settings-mic-device"))==null?void 0:D.value)||"";r&&f.setApiKey(r),c&&I.setApiKey(c),I.setDeviceId(m||null),t.settingsOpen=!1,d()});const a=document.getElementById("settings-cancel");a&&a.addEventListener("click",()=>{t.settingsOpen=!1,d()});const n=document.getElementById("settings-overlay");n&&n.addEventListener("click",r=>{r.target===n&&(t.settingsOpen=!1,d())});const o=document.getElementById("settings-detect-devices");o&&o.addEventListener("click",async()=>{try{await navigator.mediaDevices.getUserMedia({audio:!0}).then(c=>c.getTracks().forEach(m=>m.stop())).catch(()=>{});const r=await navigator.mediaDevices.enumerateDevices();t.availableMicDevices=r.filter(c=>c.kind==="audioinput").map(c=>({deviceId:c.deviceId,label:c.label||`Microphone (${c.deviceId.slice(0,8)}…)`})).filter(c=>c.deviceId&&c.deviceId!=="default"&&c.deviceId!=="communications"),d()}catch{}});const l=document.getElementById("modal-cancel");l&&l.addEventListener("click",()=>{t.modalOpen=!1,d()});const p=document.getElementById("modal-overlay");p&&p.addEventListener("click",r=>{r.target===p&&(t.modalOpen=!1,d())}),document.querySelectorAll("[data-call-type]").forEach(r=>{r.addEventListener("click",()=>{t.callType=r.dataset.callType,d(),setTimeout(()=>{var c;return(c=document.getElementById("customer-name"))==null?void 0:c.focus()},50)})});const g=document.getElementById("modal-start");g&&g.addEventListener("click",async()=>{var c,m,w,T,C,x;const r=((m=(c=document.getElementById("customer-name"))==null?void 0:c.value)==null?void 0:m.trim())||"";if(t.callType==="inbound"){const D=((w=document.getElementById("lob-select"))==null?void 0:w.value)||"personal_auto";v.startCall(D,r),f.onCallStart(j()),t.gabrielEvents=[],t.activeLead=null,t.capturedFields={}}else{const D=((T=document.getElementById("lead-select"))==null?void 0:T.value)||"";let k=null;if(D&&(k=t.leads.find(H=>H.id===D)||null),!k&&r){const H=((x=(C=document.getElementById("quick-dial-phone"))==null?void 0:C.value)==null?void 0:x.trim())||"";k={id:null,name:r,phone:H,category:"Unknown",city:"",state:"",callCount:0,notes:"",capturedData:{}}}t.activeLead=k,t.capturedFields={},t.coldCallPhase="opener",t.gabrielEvents=[],k&&f.setLeadContext(k),f.clearHistory(),v.startCall("outbound",(k==null?void 0:k.name)||r)}t.modalOpen=!1,t.currentView="call",d()});const b=document.getElementById("customer-name");b&&b.addEventListener("keydown",r=>{var c;r.key==="Enter"&&((c=document.getElementById("modal-start"))==null||c.click())}),document.querySelectorAll(".trigger-btn:not(.used)").forEach(r=>{r.addEventListener("click",()=>{v.trigger(r.dataset.trigger),d(),setTimeout(()=>{const c=document.querySelectorAll(".disclosure-card");c.length>0&&c[c.length-1].scrollIntoView({behavior:"smooth",block:"nearest"})},100)})}),document.querySelectorAll("[data-complete]").forEach(r=>{r.addEventListener("click",()=>{v.markCompleted(r.dataset.complete),d()})}),document.querySelectorAll("[data-copy]").forEach(r=>{r.addEventListener("click",()=>{const c=v.getState().allDisclosures.find(m=>m.id===r.dataset.copy);c&&navigator.clipboard.writeText(c.disclosureText).then(()=>{r.textContent="✅ Copied!",setTimeout(()=>{r.textContent="📋 Copy"},1500)})})}),document.querySelectorAll("[data-notes-toggle]").forEach(r=>{r.addEventListener("click",()=>{const c=r.dataset.notesToggle;t.expandedNotes.has(c)?t.expandedNotes.delete(c):t.expandedNotes.add(c),d()})}),document.querySelectorAll(".checklist-item").forEach(r=>{r.addEventListener("click",()=>{const c=r.dataset.checklistId;r.dataset.done==="true"?v.markIncomplete(c):v.markCompleted(c),d()})}),document.querySelectorAll("[data-stage]").forEach(r=>{r.addEventListener("click",()=>{v.setStage(r.dataset.stage),d()})});const S=document.getElementById("end-call-btn");S&&S.addEventListener("click",()=>{if(I.stop(),t.callType==="outbound")v.endCall(),t.outcomeNotes="",t.outcomeModalOpen=!0,d();else{const r=v.endCall();t.callSummary=r,t.summaryModal=!0,d()}});const O=document.getElementById("summary-back");O&&O.addEventListener("click",()=>{t.summaryModal=!1,t.callSummary=null,d()});const _=document.getElementById("summary-confirm");_&&_.addEventListener("click",()=>{v.reset(),f.onCallEnd(),I.onCallEnd(),t.summaryModal=!1,t.callSummary=null,t.currentView="dashboard",t.expandedNotes.clear(),t.gabrielEvents=[],t.liveTranscript="",t.transcriptLog=[],t.showTranscript=!1,t.spanishMode=!1,t.spanishTranslatedCustomer="",t.spanishAgentInput="",t.spanishTranslatedAgent="",t.spanishTranslating=!1,d()});const P=document.getElementById("summary-overlay");P&&P.addEventListener("click",r=>{r.target===P&&(t.summaryModal=!1,t.callSummary=null,d())});const M=document.getElementById("gabriel-collapse-tab");M&&M.addEventListener("click",()=>{t.gabrielPaneOpen=!t.gabrielPaneOpen,d()});const $=document.getElementById("transcript-toggle");$&&$.addEventListener("click",()=>{t.showTranscript=!t.showTranscript,d()});const B=document.getElementById("transcript-clear");B&&B.addEventListener("click",()=>{t.transcriptLog=[],d()});const A=document.getElementById("spanish-toggle");A&&A.addEventListener("click",()=>{t.spanishMode=!t.spanishMode,t.spanishMode||(t.spanishTranslatedCustomer="",t.spanishAgentInput="",t.spanishTranslatedAgent="",t.spanishTranslating=!1),d()});const N=document.getElementById("spanish-agent-input");N&&(N.addEventListener("input",r=>{t.spanishAgentInput=r.target.value}),N.addEventListener("keydown",async r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),await doSpanishTranslation())}),N.focus());const q=document.getElementById("spanish-translate");q&&q.addEventListener("click",async()=>{await doSpanishTranslation()});const V=document.getElementById("mic-toggle");V&&V.addEventListener("click",async()=>{t.micStatus===h.LISTENING?I.stop():await I.start()});const L=document.getElementById("gabriel-question-input");if(L){L.addEventListener("input",c=>{t.gabrielInput=c.target.value}),L.addEventListener("keydown",async c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),await se())}),L.focus();const r=L.value;L.value="",L.value=r}const Y=document.getElementById("gabriel-send");Y&&Y.addEventListener("click",async()=>{await se()}),document.querySelectorAll(".gabriel-confirm-trigger").forEach(r=>{r.addEventListener("click",c=>{c.stopPropagation();const m=r.dataset.trigger;v.trigger(m),r.textContent="✅ Applied",r.disabled=!0,d()})}),document.querySelectorAll("[data-phase]").forEach(r=>{r.addEventListener("click",()=>{t.coldCallPhase=r.dataset.phase,d()})});const Q=document.getElementById("csv-import-input");Q&&Q.addEventListener("change",async r=>{var m;const c=(m=r.target.files)==null?void 0:m[0];if(c){t.leadsImporting=!0,d();try{const w=await c.text(),{imported:T,skipped:C}=await R.importFromCSV(w);t.leads=await R.getAllLeads(),t.leadsStats=await R.getStats(),t.leadsImporting=!1,alert(`✅ Imported ${T} leads. ${C>0?`Skipped ${C}.`:""}`),d()}catch(w){t.leadsImporting=!1,alert(`❌ Import failed: ${w.message}`),d()}}}),document.querySelectorAll("[data-call-lead]").forEach(r=>{r.addEventListener("click",async()=>{const c=r.dataset.callLead,m=t.leads.find(w=>w.id===c);m&&(t.callType="outbound",t.activeLead=m,t.capturedFields={},t.coldCallPhase="opener",t.gabrielEvents=[],t.gvCallActive=!1,t.gvCallTimer="00:00",f.setLeadContext(m),f.clearHistory(),v.startCall("outbound",m.name),t.currentView="call",d())})});const W=document.getElementById("gv-call-btn");W&&W.addEventListener("click",()=>{const r=W.dataset.phone;r&&U.launchGoogleVoice(r)});const z=document.getElementById("gv-end-btn");z&&z.addEventListener("click",()=>{U.endCall(),I.stop()}),document.querySelectorAll("[data-filter]").forEach(r=>{r.addEventListener("click",()=>{t.leadsFilter=r.dataset.filter,d()})});const K=document.getElementById("leads-search");K&&(K.addEventListener("input",r=>{t.leadsSearch=r.target.value,d()}),K.focus()),document.querySelectorAll("[data-outcome]").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll("[data-outcome]").forEach(c=>c.classList.remove("selected")),r.classList.add("selected"),r.dataset.outcomeSelected="true"})});const X=document.getElementById("outcome-save");X&&X.addEventListener("click",async()=>{var w,T,C,x;const r=document.querySelector("[data-outcome].selected"),c=((w=r==null?void 0:r.dataset)==null?void 0:w.outcome)||"called",m=((C=(T=document.getElementById("outcome-notes"))==null?void 0:T.value)==null?void 0:C.trim())||"";(x=t.activeLead)!=null&&x.id&&(await R.updateLead(t.activeLead.id,{status:c,lastCalled:new Date().toISOString(),callCount:(t.activeLead.callCount||0)+1,notes:m,capturedData:{...t.activeLead.capturedData||{},...t.capturedFields}}),t.leads=await R.getAllLeads(),t.leadsStats=await R.getStats()),v.reset(),f.onCallEnd(),I.onCallEnd(),U.endCall(),t.outcomeModalOpen=!1,t.outcomeNotes="",t.activeLead=null,t.capturedFields={},t.gabrielEvents=[],t.transcriptLog=[],t.liveTranscript="",t.gvCallActive=!1,t.gvCallTimer="00:00",t.callType="inbound",t.currentView="leads",d()});const J=document.getElementById("outcome-cancel");J&&J.addEventListener("click",()=>{t.outcomeModalOpen=!1,d()});const F=document.getElementById("outcome-overlay");F&&F.addEventListener("click",r=>{r.target===F&&(t.outcomeModalOpen=!1,d())})}async function se(){const i=t.gabrielInput.trim();if(!i||t.gabrielThinking)return;const e=i;t.gabrielInput="",G({type:"USER_QUESTION",message:e,timestamp:new Date().toISOString()});const s={type:"USER_QUESTION",icon:"🧑",cls:"ev-user",label:"You asked",message:e,timestamp:new Date().toISOString()};t.gabrielEvents.unshift(s),d(),t.callType==="outbound"?await f.askColdCall(e,t.activeLead):await f.ask(e,j())}document.addEventListener("keydown",i=>{i.key==="Escape"&&(t.summaryModal?(t.summaryModal=!1,t.callSummary=null,d()):t.modalOpen?(t.modalOpen=!1,d()):t.settingsOpen&&(t.settingsOpen=!1,d())),i.ctrlKey&&i.key==="n"&&(i.preventDefault(),t.modalOpen=!0,d(),setTimeout(()=>{var e;return(e=document.getElementById("customer-name"))==null?void 0:e.focus()},100)),i.ctrlKey&&i.key===","&&(i.preventDefault(),t.settingsOpen=!t.settingsOpen,d())});async function Ue(){try{await R.init(),t.leads=await R.getAllLeads(),t.leadsStats=await R.getStats(),t.leadsLoaded=!0}catch(i){console.warn("[Gabriel] LeadDB init failed:",i)}d(),v.subscribe(()=>{const i=j();f.setCallContext(i),d()})}Ue();
