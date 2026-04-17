export function normalizeBranch(branch: string | null | undefined): string {
  if (!branch) return 'General';
  const clean = branch.trim().toUpperCase();
  
  // Mapping synonyms to standard institutional codes
  const mapping: Record<string, string> = {
    'CSE': 'CSE',
    'COMPUTER SCIENCE': 'CSE',
    'COMPUTER SCIENCE & ENGINEERING': 'CSE',
    'ECE': 'ECE',
    'ELECTRONICS': 'ECE',
    'ELECTRONICS & COMMUNICATION': 'ECE',
    'ME': 'ME',
    'MECHANICAL': 'ME',
    'MECHANICAL ENGINEERING': 'ME',
    'EE': 'EE',
    'ELECTRICAL': 'EE',
    'ELECTRICAL ENGINEERING': 'EE',
    'CE': 'CE',
    'CIVIL': 'CE',
    'CIVIL ENGINEERING': 'CE',
    'IT': 'IT',
    'INFORMATION TECHNOLOGY': 'IT'
  };

  return mapping[clean] || clean;
}

export function normalizeRole(role: string): string {
  const r = role.toUpperCase();
  if (r === 'ALUMNI') return 'Alumni';
  if (r === 'STAFF') return 'KEC Staff';
  if (r === 'STUDENT') return 'Student';
  if (r === 'ADMIN') return 'Administrator';
  return role;
}
