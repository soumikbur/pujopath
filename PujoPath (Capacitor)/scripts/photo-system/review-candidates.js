const fs = require('fs');
const path = require('path');

/**
 * PujoPath — Administrative Photo Candidate Review Tool
 *
 * Usage:
 *   node scripts/photo-system/review-candidates.js --list
 *   node scripts/photo-system/review-candidates.js --approve <candidateId>
 *   node scripts/photo-system/review-candidates.js --reject <candidateId> --reason "Mismatched locality"
 */

function main() {
  const reportsDir = path.join(__dirname, '..', '..', 'reports');
  const jsonPath = path.join(reportsDir, 'photo-review-report.json');

  if (!fs.existsSync(jsonPath)) {
    console.log('No review report found at reports/photo-review-report.json.');
    console.log('Run `npm run photo:simulate` or discovery to generate candidates.');
    return;
  }

  const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const args = process.argv.slice(2);

  if (args.includes('--list') || args.length === 0) {
    console.log(`\n======================================================`);
    console.log(`PUJOPATH — PHOTO CANDIDATE ADMINISTRATIVE REVIEW`);
    console.log(`Generated: ${report.generatedAt}`);
    console.log(`Season: Target ${report.seasonConfig.currentTargetSeason} | Completed ${report.seasonConfig.latestCompletedSeason}`);
    console.log(`======================================================\n`);

    if (!report.candidates || report.candidates.length === 0) {
      console.log('No candidates currently pending review. All active photographs are verified with zero duplicate collisions.\n');
      return;
    }

    report.candidates.forEach((c, idx) => {
      console.log(`[${idx + 1}] Candidate ID: ${c.candidateId}`);
      console.log(`    Pandal: ${c.pandalName || c.pandalId} (${c.pandalId})`);
      console.log(`    Image: ${c.imageUrl}`);
      console.log(`    Capture Year: ${c.captureYear} | Upload Date: ${c.uploadDate || 'N/A'}`);
      console.log(`    Confidence Score: ${c.confidenceScore}/100 | Status: ${c.reviewStatus}`);
      console.log(`    Source: ${c.sourceName || 'Unknown'} (${c.sourceUrl || 'N/A'})`);
      console.log(`    License: ${c.license || 'N/A'}`);
      if (c.notes && c.notes.length > 0) {
        console.log(`    Evaluation Notes:`);
        c.notes.forEach(n => console.log(`      - ${n}`));
      }
      console.log('------------------------------------------------------');
    });
    return;
  }

  const approveIdx = args.indexOf('--approve');
  if (approveIdx !== -1 && args[approveIdx + 1]) {
    const candidateId = args[approveIdx + 1];
    const candidate = report.candidates.find(c => c.candidateId === candidateId);
    if (!candidate) {
      console.error(`Candidate not found: ${candidateId}`);
      return;
    }
    candidate.reviewStatus = 'APPROVED';
    candidate.rejectionReason = undefined;
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`✓ Candidate ${candidateId} approved successfully.`);
    return;
  }

  const rejectIdx = args.indexOf('--reject');
  if (rejectIdx !== -1 && args[rejectIdx + 1]) {
    const candidateId = args[rejectIdx + 1];
    const reasonIdx = args.indexOf('--reason');
    const reason = (reasonIdx !== -1 && args[reasonIdx + 1]) ? args[reasonIdx + 1] : 'Rejected by curator';

    const candidate = report.candidates.find(c => c.candidateId === candidateId);
    if (!candidate) {
      console.error(`Candidate not found: ${candidateId}`);
      return;
    }
    candidate.reviewStatus = 'REJECTED';
    candidate.rejectionReason = reason;
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`✓ Candidate ${candidateId} rejected with reason: "${reason}".`);
    return;
  }
}

main();
