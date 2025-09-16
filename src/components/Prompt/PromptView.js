import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Label as LabelIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PromptService from '../../services/PromptService';

function PromptView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useApp();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const ragContent = "# 4. Missing/Misapplied Payments SOPs\n\n## Standard Operating Procedure (SOP) - Missing or Misapplied Payments\n\n### A. Missing Payment Investigation\n1. **Verification Requirements**\n   - Primary or authorized account holder verification required\n   - Minimum of TWO identity verification methods:\n     * Last 4 of SSN\n     * Date of birth\n     * Account security word/phrase\n     * Billing address\n     * Recent transaction verification\n\n2. **Payment History Review**\n   - Access complete payment history for past 90 days\n   - Check for pending transactions not yet posted\n   - Verify payment due dates and amounts\n   - Review all payment methods used (mail, online, phone, autopay)\n   - Check for any returned payment notices or NSF flags\n   - Note timing of customer's claim vs. expected posting date\n\n3. **Missing Payment Investigation Steps**\n   - Obtain customer's payment details:\n     * Payment date\n     * Payment amount\n     * Payment method (check, online, phone, in-store)\n     * Check number (if applicable)\n     * Confirmation number (if available)\n     * Bank account used (last 4 digits)\n   - Cross-reference with system records:\n     * Transaction logs\n     * Pending payment queue\n     * Return payment history\n     * Payment processing system\n   - Check common error scenarios:\n     * Payment applied to wrong account\n     * Payment processing delay\n     * Payment returned for insufficient funds\n     * Mail delay or lost check\n     * Technical error during online/mobile payment\n\n4. **Resolution Process**\n   - For verified missing payments:\n     * Submit payment trace request if needed\n     * Initiate missing payment claim form\n     * Document payment proof provided by customer\n     * Establish timeline for resolution (typically 7-10 business days)\n     * Waive late fees if payment proof is substantiated\n   - For unverified payment claims:\n     * Request proof of payment (canceled check, bank statement, receipt)\n     * Place temporary hold on late fees (10 business days maximum)\n     * Schedule follow-up for proof submission\n   - If payment located within system:\n     * Apply payment to correct account immediately\n     * Adjust posting date to reflect original payment date\n     * Remove any late fees or interest charges resulting from error\n     * Document how error occurred for quality improvement\n\n5. **Customer Communication**\n   - Provide claim/investigation reference number\n   - Establish clear timeline expectations:\n     * Initial investigation: 24-48 hours\n     * Full resolution: 7-10 business days\n     * Check trace: Up to 30 days\n   - Schedule appropriate follow-up contact\n   - Document all information shared with customer\n   - Provide interim account status information\n   - Explain impact on credit reporting if applicable\n\n### B. Misapplied Payment Correction\n1. **Account Verification Requirements**\n   - Verify BOTH affected accounts (source and destination)\n   - For cross-customer issues, verify identity on both accounts\n   - Heightened verification required for transfers between unrelated accounts\n\n2. **Misapplication Assessment**\n   - Determine payment misapplication type:\n     * Wrong account within same customer profile\n     * Wrong account across different customers\n     * Correct account but wrong payment allocation\n     * Duplicate payment applied\n     * Partial payment applied incorrectly\n   - Document how misapplication was discovered\n   - Verify original payment details:\n     * Original payment amount and date\n     * Payment method used\n     * Intended destination of payment\n     * Current location of payment\n\n3. **Correction Process Steps**\n   - For internal account transfers (same customer):\n     * Verify both accounts belong to same customer\n     * Process immediate account adjustment\n     * Restore payment to original date received\n     * Update both account histories with notes\n   - For cross-customer misapplications:\n     * Initiate formal payment transfer request\n     * Obtain management approval\n     * Document customer authorization from both parties if possible\n     * Notify security team for potential account number issues\n   - For incorrect allocation (e.g., wrong promotional balance):\n     * Reallocate payment to correct balance segment\n     * Adjust any interest calculated incorrectly\n     * Document proper allocation instructions\n\n4. **Fee and Interest Adjustments**\n   - Reverse any late fees caused by misapplication\n   - Adjust interest charges resulting from error\n   - Calculate correct interest based on proper payment application\n   - Refund overcharges if applicable\n   - Document all adjustments made and reasons\n\n5. **Preventive Measures**\n   - Identify cause of misapplication:\n     * Customer error (wrong account number)\n     * System error\n     * Representative error\n     * Similar account numbers\n   - Take appropriate action:\n     * Update account alerts/flags for similar accounts\n     * Submit system error report if applicable\n     * Document training opportunity if staff error\n   - Provide customer education to prevent recurrence\n   - Update autopay instructions if needed\n   - Issue new account number if recurring problem\n\n### C. Payment Delay Resolution\n1. **Payment Processing Review**\n   - Verify payment was actually initiated\n   - Determine normal processing time for payment method used\n   - Check for system delays or known issues\n   - Verify payment is truly delayed vs. customer expectation misalignment\n\n2. **Delay Assessment**\n   - Calculate actual delay against expected processing time:\n     * Electronic payments: 1-2 business days standard\n     * Mail payments: 5-7 business days standard\n     * In-store payments: 1-2 business days standard\n     * Bank bill pay: 2-5 business days standard\n   - Determine if delay is within normal parameters\n   - Check for payment system alerts or known issues\n   - Verify payment wasn't rejected or returned\n\n3. **Resolution Options**\n   - For payments within normal processing window:\n     * Explain standard processing times\n     * Offer expedited payment option if needed\n     * Set expectations for posting date\n   - For legitimately delayed payments:\n     * Submit payment trace request\n     * Waive any associated late fees\n     * Place account in \"payment pending\" status\n     * Suppress negative credit reporting until resolved\n   - For returned/rejected payments:\n     * Explain reason for return/rejection\n     * Assist with new payment submission\n     * Apply late fee waiver if applicable\n\n4. **Documentation Requirements**\n   - Document expected vs. actual processing time\n   - Record all customer contact regarding delay\n   - Note any system issues contributing to delay\n   - Document fee waiver justification\n   - Record payment trace number if applicable\n   - Flag account for follow-up if needed\n\n5. **Customer Education**\n   - Explain typical processing times by payment method\n   - Recommend faster payment alternatives if appropriate\n   - Discuss autopay enrollment to prevent delays\n   - Explain cut-off times for same-day processing\n   - Provide confirmation number protocols for future reference\n\n## Customer Personas Prompt\n\n```\nYou are playing the role of a banking customer contacting Synchrony Bank customer service regarding an issue with a payment. Follow these character traits, background, and scenario instructions carefully:\n\nSCENARIO TYPE: [Missing Payment / Misapplied Payment / Payment Delay]\n\nCUSTOMER PROFILE:\n- Name: {FIRST_NAME} {LAST_NAME}\n- Account Age: {MONTHS/YEARS} with Synchrony\n- Payment History: {Always on-time/Usually on-time/Occasionally late}\n- Previous Issues: {First payment problem/Had issues before}\n- Technical Comfort: {High/Medium/Low}\n- Emotional State: {Concerned/Frustrated/Worried/Calm but firm}\n\nSCENARIO BACKGROUND:\n[FOR MISSING PAYMENT]\nYou made a payment of ${AMOUNT} on {DATE} via {payment method: online banking/check by mail/phone/in-store} that isn't showing on your account. You have a {confirmation number/receipt/canceled check/bank statement showing withdrawal} as proof of payment. Your due date was {DATE} and you're concerned about {late fees/credit reporting/account status}. You made the payment {number} days before the due date and always pay {on time/early}.\n\n[FOR MISAPPLIED PAYMENT]\nYour payment of ${AMOUNT} was applied to {the wrong account/the wrong promotional balance/someone else's account}. You discovered this when {checking your statement/receiving a late fee/getting a payment due notice/seeing your balance was wrong}. You made the payment on {DATE} via {method} and have confirmation number {NUMBER}. You're concerned about {getting the payment corrected/late fees/interest charges/credit reporting}.\n\n[FOR PAYMENT DELAY]\nYou made a payment of ${AMOUNT} on {DATE} via {payment method}, but it's still not showing on your account after {number} days. The payment was {number} days {before/after} your due date of {DATE}. Your online banking shows the money {has/hasn't} left your bank account. You're concerned about {late fees/credit reporting/account status} and need to know when the payment will post.\n\nCONVERSATION STYLE:\n- Begin by clearly explaining your payment issue\n- Provide relevant payment details when asked (date, amount, method)\n- Express appropriate concern about account impact\n- Show {patience/growing frustration} based on agent's helpfulness\n- Ask specific questions about resolution timeline\n- Request clear explanation of next steps\n- Show appreciation for helpful information\n\nIMPORTANT BEHAVIORAL NOTES:\n- If the agent doesn't verify your identity properly, seem concerned about account security\n- If the agent doesn't ask for payment details, volunteer the key information\n- If the agent doesn't explain the investigation process, ask \"What happens next?\"\n- If the agent doesn't provide a timeline, ask \"When will this be resolved?\"\n- Express relief if late fees are mentioned as being waived during investigation\n- Show concern about credit reporting impact if not addressed by the agent\n- Be cooperative but increasingly worried if resolution is unclear or delayed\n\nKEY PHRASES TO USE:\n- \"I made a payment that's not showing on my account\"\n- \"I have a confirmation number/receipt for this payment\"\n- \"Will this affect my credit report?\"\n- \"Can any late fees be removed while this is being investigated?\"\n- \"How long will the investigation take?\"\n- \"What should I do about my next payment?\"\n- \"Can I get a reference number for this investigation?\"\n\nRespond naturally as this customer would throughout the conversation, adjusting your tone based on how well the agent handles your payment issue and provides clear resolution steps.\n```\n\n## Evaluator Prompt\n\n```\nYou are an expert banking compliance evaluator specializing in payment dispute resolution for credit card customer service. Your task is to assess an agent's performance during a customer interaction regarding missing, misapplied, or delayed payments.\n\nASSESSMENT CRITERIA:\n\n1. VERIFICATION & SECURITY (Critical) - Score range: 1-10\n   - Did agent properly verify customer identity using at least 2 secure methods?\n   - Were security protocols followed for payment investigation?\n   - Did agent verify payment details thoroughly?\n   - Were account access standards maintained throughout the call?\n   \n2. PAYMENT INVESTIGATION PROCESS (Critical) - Score range: 1-10\n   - Did agent collect all necessary payment details?\n   - Was the correct investigation procedure initiated?\n   - Did agent check all relevant payment systems?\n   - Was the investigation properly documented?\n   \n3. RESOLUTION HANDLING - Score range: 1-10\n   - Did agent take appropriate action based on findings?\n   - Were fee adjustments handled correctly?\n   - Was the timeline for resolution clearly communicated?\n   - Did agent provide a reference/confirmation number?\n   \n4. CUSTOMER IMPACT MANAGEMENT - Score range: 1-10\n   - Did agent address credit reporting concerns?\n   - Were late fees appropriately waived during investigation?\n   - Was the impact on customer's account clearly explained?\n   - Did agent provide guidance on pending/future payments?\n   \n5. CUSTOMER EXPERIENCE - Score range: 1-10\n   - Did agent demonstrate appropriate empathy for the situation?\n   - Were explanations clear and free of jargon?\n   - Did agent take ownership of the resolution process?\n   - Was the customer reassured appropriately?\n\nSPECIFIC SOP CHECKPOINTS:\n\n[FOR MISSING PAYMENT]\n- Agent must verify customer identity\n- Agent must collect complete payment details (date, amount, method, confirmation)\n- Agent must check all payment systems/histories\n- Agent must initiate formal investigation if payment not found\n- Agent must provide investigation reference number\n- Agent must explain resolution timeline (7-10 business days standard)\n- Agent must address late fee concerns during investigation\n- Agent must explain impact on credit reporting\n\n[FOR MISAPPLIED PAYMENT]\n- Agent must verify affected account(s)\n- Agent must determine misapplication type\n- Agent must initiate appropriate correction process\n- Agent must explain adjustment of fees/interest\n- Agent must document cause of misapplication\n- Agent must provide timeline for correction\n- Agent must confirm if additional authorization needed\n\n[FOR PAYMENT DELAY]\n- Agent must verify payment was initiated\n- Agent must compare against standard processing times\n- Agent must determine if delay is within normal parameters\n- Agent must explain normal processing windows by payment type\n- Agent must offer appropriate resolution based on findings\n- Agent must address late fee concerns if applicable\n- Agent must provide guidance on payment status\n\nEVALUATION FORMAT:\n\n{\n  \"overallScore\": X,\n  \"verificationScore\": X,\n  \"investigationProcessScore\": X,\n  \"resolutionHandlingScore\": X,\n  \"customerImpactScore\": X,\n  \"customerExperienceScore\": X,\n  \"criticalErrors\": [\"Error 1\", \"Error 2\"],\n  \"strengths\": [\"Strength 1\", \"Strength 2\"],\n  \"improvementAreas\": [\"Area 1\", \"Area 2\"],\n  \"missedSOPSteps\": [\"Step 1\", \"Step 2\"],\n  \"regulatoryRisks\": [\"Risk 1\", \"Risk 2\"],\n  \"feedbackSummary\": \"Concise evaluation summary\"\n}\n\nIn your evaluation, highlight any CRITICAL errors such as failing to properly investigate the payment, not addressing credit reporting concerns, or incorrect fee handling. These errors automatically cap the overall score at 5 regardless of other performance areas due to regulatory compliance risks and potential Fair Credit Reporting Act violations.\n\nBe specific about missed SOP steps rather than general feedback. Reference exact requirements from Synchrony Bank's payment investigation procedures and note any regulatory compliance issues related to Regulation Z (Truth in Lending Act), Regulation E (Electronic Fund Transfer Act), or the Fair Credit Billing Act.\n```\n\n4. Business and Technical Workflows\nUser Registration Workflow\n\nUser submits registration form through the front-end.\n\nUserController.registerUser() receives input, calls validation helpers.\n\nIf valid, a User entity is persisted; else, returns error.\n\nInitiates KYC by sending message to asynchronous KYC service (planned via event bus).\n\nUpon KYC success, Account Service provisioned for first account.\n\nSends notification (future enhancement).\n\nKey Classes Involved: UserController, UserService, UserRepository, AccountServiceClient\n\nDeposit/Withdrawal Workflow\n\nUser requests deposit/withdrawal via API Gateway.\n\nGateway authenticates, routes to Transaction Service.\n\nTransaction Service checks user’s account with Account Service.\n\nOn deposit: increases balance, persists in Transaction and Account repositories.\n\nOn withdrawal: checks for sufficient funds, decrements if possible.\n\nLogs event and returns operation result.\n\nConcerns Addressed in Code: Atomicity (via @Transactional), idempotency (unique transaction IDs).\n\nFund Transfer Workflow (Intra-Bank)\n\nUser initiates transfer via mobile app.\n\nFundTransferController receives request, validates inputs.\n\nService queries AccountService for both users.\n\nMoves funds:\n\nDebits sender’s account.\n\nCredits beneficiary’s account.\n\nSaves both updates and transaction logs atomically.\n\nUpdates TransactionService, which records both sides.\n\nTriggers email/SMS notifications (event-based, future-proofed).\n\nArchitecture Logic\n\nService-to-service communication using Feign or RESTTemplate, with resilient patterns.\n\nBusiness invariants are strongly upheld by data-layer validation and business logic segregation.\n\nFuture microservices (loans, cards, rewards) can be dropped in effortlessly.\n\n# 3. Promotions & Payment Transactions SOPs\n\n## Standard Operating Procedure (SOP) - Balance Transfers and Pay-by-Phone\n\n### A. Balance Transfer Process\n1. **Verification Requirements**\n   - Primary account holder verification required (not authorized users)\n   - Minimum of TWO identity verification methods:\n     * Last 4 of SSN\n     * Date of birth\n     * Account security word/phrase\n     * Billing address\n     * Recent transaction verification\n   - Additional verification required for transfers over $5,000\n\n2. **Account Eligibility Assessment**\n   - Verify account is in good standing (not past due)\n   - Check available credit for requested transfer amount\n   - Confirm account is not restricted or flagged\n   - Verify customer is not in bankruptcy proceedings\n   - Check eligibility for promotional APR offers\n\n3. **Competitive Balance Transfer Process**\n   - Obtain details of competing credit card:\n     * Issuing bank name\n     * Account number and payment address\n     * Exact payoff amount\n   - Explain balance transfer terms:\n     * Applicable fees (typically 3-5% of transfer amount)\n     * Standard vs. promotional APR and duration\n     * Minimum and maximum transfer amounts\n     * Processing timeframe (7-14 business days)\n   - Disclose balance transfer limitations:\n     * Cannot exceed available credit minus fees\n     * Cannot transfer to another Synchrony account\n     * Continued payments on other card until confirmed\n     * No grace period on new purchases during promo period\n\n4. **Balance Transfer Execution**\n   - Submit balance transfer request with all required details\n   - Provide confirmation number for the transaction\n   - Explain transfer processing timeline\n   - Set expectations for when transfer will appear on statement\n   - Advise continuing payments on other card until transfer confirmation\n   - Confirm payment address and account number accuracy\n\n5. **Post-Transfer Follow Up Requirements**\n   - Schedule follow-up if transfer exceeds $5,000\n   - Document all disclosures provided to customer\n   - Note promotion code applied to the transfer\n   - Create calendar reminder for promotion expiration date\n   - Flag account for satisfaction survey (if applicable)\n\n### B. Pay-by-Phone Transaction Process\n1. **Verification Requirements**\n   - Full cardholder verification required (THREE methods minimum)\n   - Additional verification for unusual payment amounts or first-time pay-by-phone\n   - Recent transaction verification highly recommended\n   - High-risk indicators requiring enhanced verification:\n     * New account requesting large payment\n     * Payment amount significantly different from typical pattern\n     * Multiple payment attempts in short timeframe\n     * Payment from unrecognized bank account\n\n2. **Payment Account Information Collection**\n   - Bank routing number (9 digits)\n   - Bank account number\n   - Account type (checking/savings)\n   - Bank name\n   - Name(s) on bank account\n   - Confirm customer authorization to use account\n\n3. **Payment Processing Steps**\n   - Confirm payment amount\n   - Explain all available processing options:\n     * Standard (3-5 business days, no fee)\n     * Expedited (same/next day, $10-15 fee)\n     * Future-dated (scheduled for later date)\n   - Disclose cut-off times for same-day processing\n   - Explain non-sufficient funds (NSF) consequences:\n     * Returned payment fee ($25-40)\n     * Possible late fee if payment due date passes\n     * Potential delinquency reporting\n   - Process payment through authorized payment system\n   - Provide confirmation/reference number\n\n4. **Post-Payment Confirmation**\n   - Confirm payment details (amount, processing speed, date)\n   - Update account notes with payment details and reference number\n   - Inform customer when payment will post and be available\n   - Explain impact on available credit (immediate vs. delayed)\n   - Send confirmation via customer's preferred method (email/text)\n\n5. **Payment Education**\n   - Inform about other payment options:\n     * Online bill pay\n     * Mobile app payments\n     * Automatic payments\n     * Branch/store payments (if applicable)\n     * Mail payments\n   - Discuss benefits of autopay enrollment\n   - Highlight fee-free payment methods\n\n### C. Promotional Offer Processing\n1. **Promotion Eligibility Verification**\n   - Check customer qualification for specific promotion\n   - Verify promotion code validity and expiration\n   - Confirm account standing meets promotion criteria\n   - Check prior promotion history/stacking rules\n   - Review any exclusion criteria\n\n2. **Promotion Types and Handling**\n   - Special financing promotions:\n     * Deferred interest (explain precisely how it works)\n     * 0% APR for X months (explain difference from deferred interest)\n     * Reduced APR offers\n   - Rewards promotions:\n     * Bonus points/cash back offers\n     * Special redemption opportunities\n     * Limited-time earning multipliers\n   - Fee reduction promotions:\n     * Annual fee waiver/reduction codes\n     * Balance transfer fee reductions\n     * Foreign transaction fee waivers\n\n3. **Promotion Application Process**\n   - Select correct promotion code in system\n   - Apply to correct account segment/balance\n   - Set appropriate start and end dates\n   - Document all terms disclosed to customer\n   - Explain what purchases/transactions qualify\n   - Provide written confirmation of enrollment\n\n4. **Required Customer Disclosures**\n   - Exact promotional terms and duration\n   - Minimum payment requirements during promotional period\n   - Consequences of late/missed payments on promotional terms\n   - What happens at promotion end date\n   - For deferred interest: importance of full payment before end date\n\n5. **Post-Promotion Application**\n   - Set appropriate account alerts/flags\n   - Schedule any required follow-up actions\n   - Document promotion application details in notes\n   - Confirm customer understanding of terms\n   - Address any questions about promotion mechanics\n\n## Customer Personas Prompt\n\n```\nYou are playing the role of a banking customer contacting Synchrony Bank customer service regarding balance transfers, payment processing, or promotional offers. Follow these character traits, background, and scenario instructions carefully:\n\nSCENARIO TYPE: [Balance Transfer / Pay-by-Phone / Promotional Offer]\n\nCUSTOMER PROFILE:\n- Name: {FIRST_NAME} {LAST_NAME}\n- Account Age: {MONTHS/YEARS} with Synchrony\n- Credit Limit: ${AMOUNT}\n- Current Balance: ${AMOUNT}\n- Payment History: {Always on-time/Occasional late payment/Recently improved}\n- Technical Comfort: {High/Medium/Low}\n- Emotional State: {Neutral/Confused/Slightly impatient/Anxious}\n\nSCENARIO BACKGROUND:\n[FOR BALANCE TRANSFER]\nYou want to transfer a balance of ${AMOUNT} from your {COMPETITOR BANK} credit card to take advantage of a lower interest rate. Your {COMPETITOR BANK} card has an APR of {PERCENTAGE}%. You {do/don't} know your exact payoff amount. You {are/aren't} aware of balance transfer fees. You're hoping to {save on interest/consolidate debt/simplify payments}.\n\n[FOR PAY-BY-PHONE]\nYou need to make an {urgent/scheduled} payment of ${AMOUNT} on your account. Your payment is due in {X} days. You {have/haven't} used pay-by-phone before. You have a {checking/savings} account at {BANK NAME} that you want to use. You {do/don't} have your routing and account number ready. You {are/aren't} willing to pay an expedited payment fee if necessary.\n\n[FOR PROMOTIONAL OFFER]\nYou received a {mail/email/mobile app} offer for {0% APR for X months/deferred interest/special financing/bonus rewards}. You {do/don't} understand all the terms. You want to make a ${AMOUNT} purchase for {ITEM/PURPOSE} and want to use this promotion. You {have/haven't} used Synchrony promotions before. You're concerned about {how minimum payments work/what happens when promotion ends/if your purchase qualifies}.\n\nCONVERSATION STYLE:\n- Start with a brief explanation of what you're calling about\n- Answer verification questions when asked\n- Express {confusion/interest/concern} about specific terms or details\n- Ask 1-3 clarifying questions about the process\n- Show {appreciation/frustration} based on the clarity of the agent's explanation\n- If the agent skips important disclosures, ask specifically about them\n- If the agent is thorough, express gratitude for the detailed information\n\nIMPORTANT BEHAVIORAL NOTES:\n- If the agent doesn't verify your identity properly, seem hesitant to provide sensitive information\n- For balance transfers: If fees aren't disclosed, specifically ask \"Are there any fees?\"\n- For pay-by-phone: If processing time isn't mentioned, ask \"When will this payment be posted?\"\n- For promotions: If deferred interest isn't clearly explained, ask \"What happens if I don't pay it off in time?\"\n- Show confusion if terms are explained using banking jargon\n- Be satisfied only when you have a clear understanding of the process and timeline\n\nKEY PHRASES TO USE:\n- \"I want to {make a payment/transfer a balance/use a promotional offer}\"\n- \"Can you explain how the {process/fees/interest/promotion} works?\"\n- \"When will the {payment/transfer/promotion} be {processed/applied/available}?\"\n- \"Are there any {fees/penalties/deadlines} I should know about?\"\n- \"What do I need to do next?\"\n- \"Can I get a confirmation {number/email/letter}?\"\n\nRespond naturally as this customer would throughout the conversation, adjusting your tone based on how well the agent follows proper procedures and provides clear information.\n```\n\n## Evaluator Prompt\n\n```\nYou are an expert banking compliance evaluator specializing in credit card payment processing, balance transfers, and promotional offers. Your task is to assess an agent's performance during a customer interaction in these areas.\n\nASSESSMENT CRITERIA:\n\n1. VERIFICATION & SECURITY (Critical) - Score range: 1-10\n   - Did agent properly verify customer identity using appropriate methods?\n   - Was enhanced verification used for high-risk transactions when needed?\n   - Were security protocols followed for handling sensitive banking information?\n   - Did agent refrain from requesting prohibited information?\n   \n2. INFORMATION ACCURACY (Critical) - Score range: 1-10\n   - Did agent provide correct information about fees and processing times?\n   - Were promotional terms accurately explained?\n   - Was information about interest rates and terms factually correct?\n   - Did agent provide accurate post-transaction expectations?\n   \n3. DISCLOSURE COMPLIANCE (Critical) - Score range: 1-10\n   - Were all required disclosures provided clearly?\n   - Did agent explain promotional terms completely, including end conditions?\n   - Were fees and timing disclosed before processing transactions?\n   - Did agent disclose any limitations or restrictions properly?\n   \n4. PROCESS EXECUTION - Score range: 1-10\n   - Did agent collect all required information for the transaction?\n   - Was the transaction processed correctly in the system?\n   - Did agent provide confirmation/reference numbers?\n   - Were next steps clearly communicated to the customer?\n   \n5. CUSTOMER EXPERIENCE - Score range: 1-10\n   - Did agent explain complex banking terms in customer-friendly language?\n   - Were the customer's questions addressed comprehensively?\n   - Did agent demonstrate appropriate empathy and professionalism?\n   - Was the interaction efficient while still being thorough?\n\nSPECIFIC SOP CHECKPOINTS:\n\n[FOR BALANCE TRANSFER]\n- Agent must verify primary cardholder identity\n- Agent must confirm account eligibility for balance transfer\n- Agent must collect complete details of competing credit card\n- Agent must disclose balance transfer fee (typically 3-5%)\n- Agent must explain processing timeframe (7-14 business days)\n- Agent must advise continuing payments until transfer confirmation\n- Agent must provide a confirmation number\n\n[FOR PAY-BY-PHONE]\n- Agent must complete enhanced verification (THREE methods minimum)\n- Agent must collect complete banking information\n- Agent must confirm payment amount and authorization\n- Agent must explain all processing options and applicable fees\n- Agent must disclose cut-off times for same-day processing\n- Agent must provide confirmation/reference number\n- Agent must explain when payment will post to account\n\n[FOR PROMOTIONAL OFFERS]\n- Agent must verify customer qualification for specific promotion\n- Agent must apply correct promotion code in system\n- Agent must disclose exact promotional terms and duration\n- Agent must explain minimum payment requirements\n- Agent must explain consequences of late/missed payments\n- Agent must describe what happens at promotion end date\n- For deferred interest: Agent must emphasize importance of full payment before end date\n\nEVALUATION FORMAT:\n\n{\n  \"overallScore\": X,\n  \"verificationScore\": X,\n  \"informationAccuracyScore\": X,\n  \"disclosureComplianceScore\": X,\n  \"processExecutionScore\": X,\n  \"customerExperienceScore\": X,\n  \"criticalErrors\": [\"Error 1\", \"Error 2\"],\n  \"strengths\": [\"Strength 1\", \"Strength 2\"],\n  \"improvementAreas\": [\"Area 1\", \"Area 2\"],\n  \"missedSOPSteps\": [\"Step 1\", \"Step 2\"],\n  \"regulatoryRisks\": [\"Risk 1\", \"Risk 2\"],\n  \"feedbackSummary\": \"Concise evaluation summary\"\n}\n\nIn your evaluation, highlight any CRITICAL errors such as missing mandatory disclosures, providing incorrect information about promotional terms, or insufficient identity verification. These errors automatically cap the overall score at 5 regardless of other performance areas due to regulatory compliance risks.\n\nBe specific about missed SOP steps rather than general feedback. Reference exact requirements from Synchrony Bank's procedures and note any regulatory compliance issues such as Truth in Lending Act (TILA) or Electronic Fund Transfer Act (EFTA) implications.\n```";
  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    setLoading(true);
    try {
      const response = await PromptService.getPromptById(id);
      if (response.success) {
        setPrompt(response.data);
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Prompt not found',
        });
        navigate('/prompts');
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
      navigate('/prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (prompt?.prompt) {
      try {
        await navigator.clipboard.writeText(prompt.prompt);
        actions.addNotification({
          type: 'success',
          title: 'Copied',
          message: 'Prompt text copied to clipboard',
        });
      } catch (error) {
        console.error('Failed to copy:', error);
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to copy prompt text',
        });
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${prompt.name}"? This action cannot be undone.`)) {
      try {
        const response = await PromptService.deletePrompt(id);
        if (response.success) {
          actions.addNotification({
            type: 'success',
            title: 'Success',
            message: 'Prompt deleted successfully',
          });
          navigate('/prompts');
        } else {
          actions.addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete prompt',
          });
        }
      } catch (error) {
        console.error('Error deleting prompt:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'persona-prompt':
        return { color: '#28a745', bgcolor: 'rgba(40, 167, 69, 0.1)' };
      case 'evaluator-prompt':
        return { color: '#007bff', bgcolor: 'rgba(0, 123, 255, 0.1)' };
      default:
        return { color: '#6c757d', bgcolor: 'rgba(108, 117, 125, 0.1)' };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!prompt) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Prompt not found
        </Typography>
        <Button onClick={() => navigate('/prompts')} sx={{ mt: 2 }}>
          Back to Prompts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
          <Box display="flex" alignItems="center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/prompts')}
              sx={{
                mr: 2,
                color: '#003DA5',
                '&:hover': {
                  backgroundColor: 'rgba(0, 61, 165, 0.05)',
                },
              }}
            >
              Back to Prompts
            </Button>
            <div>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#003DA5' }}>
                {prompt.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip label={`ID: ${prompt.id}`} size="small" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  Created: {formatDate(prompt.createdAt)}
                </Typography>
                {prompt.updatedAt && prompt.updatedAt !== prompt.createdAt && (
                  <Typography variant="body2" color="text.secondary">
                    • Updated: {formatDate(prompt.updatedAt)}
                  </Typography>
                )}
              </Box>
            </div>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={handleCopyPrompt}
              sx={{
                borderColor: '#17a2b8',
                color: '#17a2b8',
                '&:hover': {
                  borderColor: '#138496',
                  backgroundColor: 'rgba(23, 162, 184, 0.05)',
                },
              }}
            >
              Copy
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/prompts/${id}/edit`)}
              sx={{
                borderColor: '#FFD100',
                color: '#FFD100',
                '&:hover': {
                  borderColor: '#FFC107',
                  backgroundColor: 'rgba(255, 209, 0, 0.05)',
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{
                borderColor: '#dc3545',
                color: '#dc3545',
                '&:hover': {
                  borderColor: '#c82333',
                  backgroundColor: 'rgba(220, 53, 69, 0.05)',
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* ✅ NEW: Type and Tags Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600, mb: 2 }}>
                Classification
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Type */}
                {prompt.type && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <CategoryIcon sx={{ color: '#6c757d' }} />
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: '#6c757d' }}>
                      Type:
                    </Typography>
                    <Chip
                      label={prompt.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      sx={{
                        ...getTypeColor(prompt.type),
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          px: 2,
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <LabelIcon sx={{ color: '#6c757d', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: '#6c757d', mt: 0.5 }}>
                      Tags:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {prompt.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: '#f8f9fa',
                            color: '#495057',
                            border: '1px solid #dee2e6',
                            '&:hover': {
                              backgroundColor: '#e9ecef',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* No type or tags message */}
                {(!prompt.type && (!prompt.tags || prompt.tags.length === 0)) && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No classification information available
                  </Typography>
                )}
              </Box>
              
              <Divider sx={{ mt: 3 }} />
            </Box>

            {/* Summary Section */}
            {prompt.summary && (
              <>
                <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600 }}>
                  Summary
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {prompt.summary}
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </>
            )}

            {/* Prompt Content */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: '#003DA5', fontWeight: 600 }}>
                Prompt Content
              </Typography>
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={handleCopyPrompt}
                sx={{
                  color: '#17a2b8',
                  '&:hover': {
                    backgroundColor: 'rgba(23, 162, 184, 0.05)',
                  },
                }}
              >
                Copy Text
              </Button>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #e9ecef',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="body1" 
                component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'inherit',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {prompt.prompt}
              </Typography>
            </Paper>

            {/* RAG Content */}
            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={5} mb={2}>
              <Typography variant="h6" sx={{ color: '#003DA5', fontWeight: 600 }}>
                Syncrhony SOP policies RAG Chunk 
              </Typography>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #e9ecef',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="body1" 
                component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'inherit',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {ragContent}
              </Typography>
            </Paper>

            {/* Metadata */}
            <Box mt={4} p={3} sx={{ backgroundColor: 'rgba(0, 61, 165, 0.02)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600 }}>
                Metadata
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Prompt ID
                  </Typography>
                  <Typography variant="body2">
                    {prompt.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Character Count
                  </Typography>
                  <Typography variant="body2">
                    {prompt.prompt.length} / 4096 characters
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Word Count
                  </Typography>
                  <Typography variant="body2">
                    ~{prompt.prompt.split(/\s+/).length} words
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Created Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(prompt.createdAt)}
                  </Typography>
                </Box>
                {prompt.updatedAt && prompt.updatedAt !== prompt.createdAt && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Last Modified
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(prompt.updatedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}

export default PromptView;
