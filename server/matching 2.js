/**
 * Smart Matching Engine
 * Score = skillMatch(50) + proximity(30) + availability(20)
 */

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateMatch(volunteer, task) {
  // Skill matching (0-50 points)
  const requiredSkills = task.requiredSkills || [];
  const volunteerSkills = volunteer.skills || [];
  const matchedSkills = requiredSkills.filter((s) =>
    volunteerSkills.map((v) => v.toLowerCase()).includes(s.toLowerCase())
  );
  const skillScore =
    requiredSkills.length > 0
      ? (matchedSkills.length / requiredSkills.length) * 50
      : 0;

  // Proximity matching (0-30 points)
  let proximityScore = 0;
  if (volunteer.location && task.location) {
    const distance = haversineDistance(
      volunteer.location.lat,
      volunteer.location.lng,
      task.location.lat,
      task.location.lng
    );
    // Within 1km = 30 pts, linear decay, 0 at 100km
    proximityScore = Math.max(0, 30 * (1 - distance / 100));
  }

  // Availability (0-20 points)
  const availabilityScore = volunteer.available ? 20 : 0;

  const total = Math.round((skillScore + proximityScore + availabilityScore) * 10) / 10;

  return {
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    volunteerEmail: volunteer.email,
    volunteerSkills: volunteer.skills,
    volunteerLocation: volunteer.location,
    volunteerAvailable: volunteer.available,
    totalScore: total,
    maxScore: 100,
    breakdown: {
      skill: Math.round(skillScore * 10) / 10,
      proximity: Math.round(proximityScore * 10) / 10,
      availability: availabilityScore,
    },
    matchedSkills,
    distance: volunteer.location && task.location
      ? Math.round(
          haversineDistance(
            volunteer.location.lat,
            volunteer.location.lng,
            task.location.lat,
            task.location.lng
          ) * 10
        ) / 10
      : null,
  };
}

export function findTopMatches(volunteers, task, limit = 3) {
  const scored = volunteers
    .map((v) => calculateMatch(v, task))
    .sort((a, b) => b.totalScore - a.totalScore);

  return scored.slice(0, limit).map((match, index) => ({
    ...match,
    rank: index + 1,
    isBestMatch: index === 0,
  }));
}
