import { Linking } from 'react-native';

export const EXERCISE_INFO = {
  'Bench Press':            { muscles: ['chest', 'shoulders', 'triceps'],       tips: ['Retract shoulder blades and keep them pinched together', 'Lower bar to lower chest, not upper chest', 'Drive feet into floor, maintain slight arch in lower back'] },
  'Incline Bench Press':    { muscles: ['chest', 'shoulders', 'triceps'],       tips: ['Set bench to 30–45°', 'Control the descent — 2 seconds down', 'Keep elbows at 75° angle, not flared out'] },
  'Dumbbell Fly':           { muscles: ['chest'],                               tips: ['Slight bend in elbows throughout', 'Stretch at the bottom, squeeze at the top', 'Lower only until you feel a chest stretch'] },
  'Push-Ups':               { muscles: ['chest', 'shoulders', 'triceps'],       tips: ['Body forms a straight line head to heel', 'Elbows at 45° from torso', 'Full range of motion — chest nearly touches floor'] },
  'Cable Fly':              { muscles: ['chest'],                               tips: ['Hinge slightly forward at hips', 'Maintain slight elbow bend throughout', 'Squeeze chest hard at the center'] },
  'Decline Bench Press':    { muscles: ['chest', 'triceps'],                    tips: ['Feet secured on the bench pad', 'Lower bar to lower chest', 'Grip slightly wider than shoulder-width'] },
  'Weighted Dips':          { muscles: ['chest', 'triceps', 'shoulders'],       tips: ['Lean forward to target chest more', 'Lower until upper arms are parallel to floor', 'Lock out fully at top'] },

  'Overhead Press':         { muscles: ['shoulders', 'triceps', 'upper_back'],  tips: ['Core braced throughout', 'Press in a slight backward arc around your face', 'Do not arch lower back excessively'] },
  'Lateral Raise':          { muscles: ['shoulders'],                           tips: ['Lead with elbows, not wrists', 'Stop at shoulder height — no higher', 'Slight forward lean improves deltoid activation'] },
  'Front Raise':            { muscles: ['shoulders'],                           tips: ['Keep arms nearly straight', 'Raise to shoulder height — no higher', 'Control the descent slowly'] },
  'Arnold Press':           { muscles: ['shoulders', 'triceps'],                tips: ['Start with palms facing you, rotate outward as you press', 'Full range of motion on the rotation', 'Do not use momentum'] },
  'Face Pull':              { muscles: ['upper_back', 'shoulders'],             tips: ['Pull to forehead level, not chin', 'Elbows high and wide at end position', 'External rotate at the top — thumbs back'] },
  'Upright Row':            { muscles: ['shoulders', 'upper_back'],             tips: ['Grip slightly narrower than shoulders', 'Lead with elbows upward', 'Stop when elbows reach shoulder height'] },
  'Military Press':         { muscles: ['shoulders', 'triceps'],                tips: ['Perform standing for more core engagement', 'Bar starts at upper chest, press straight overhead', 'Squeeze glutes to protect lower back'] },

  'Barbell Curl':           { muscles: ['biceps'],                              tips: ['Keep elbows pinned to sides', 'Full extension at bottom, squeeze hard at top', 'Avoid swinging — if you swing, lower the weight'] },
  'Dumbbell Curl':          { muscles: ['biceps'],                              tips: ['Supinate (rotate) wrist as you curl up', 'Alternate arms or do both simultaneously', 'Full range of motion'] },
  'Hammer Curl':            { muscles: ['biceps'],                              tips: ['Neutral grip (palms facing each other) throughout', 'Targets the brachialis for arm thickness', 'Control the negative'] },
  'Preacher Curl':          { muscles: ['biceps'],                              tips: ['Pad supports upper arm — keeps strict form', 'Do not fully lock out at bottom — keep tension', 'Slow and controlled'] },
  'Cable Curl':             { muscles: ['biceps'],                              tips: ['Cable keeps constant tension throughout the rep', 'Keep upper arm stationary', 'Full squeeze at top'] },
  'Concentration Curl':     { muscles: ['biceps'],                              tips: ['Elbow braced on inner thigh', 'Rotate wrist up as you curl', 'Peak contraction at top'] },
  'Chin-Ups':               { muscles: ['biceps', 'lats'],                      tips: ['Underhand grip, shoulder-width', 'Pull chest to bar, not chin', 'Full hang at bottom'] },

  'Skull Crusher':          { muscles: ['triceps'],                             tips: ['Keep upper arms vertical and stationary', 'Lower to forehead or just behind head', 'Control the descent — squeeze up'] },
  'Tricep Pushdown':        { muscles: ['triceps'],                             tips: ['Keep elbows pinned to sides', 'Full extension — lock out at bottom', 'Lean slightly forward for better activation'] },
  'Tricep Dip':             { muscles: ['triceps', 'chest'],                    tips: ['Stay upright to target triceps more', 'Lower until elbows reach 90°', 'Full lockout at top'] },
  'Overhead Extension':     { muscles: ['triceps'],                             tips: ['Stretches the long head of triceps', 'Keep elbows close to ears', 'Control the weight — do not let it pull you back'] },
  'Close Grip Bench':       { muscles: ['triceps', 'chest'],                    tips: ['Grip shoulder-width — not too narrow', 'Elbows stay close to body', 'Lower to lower chest'] },
  'Diamond Push-Up':        { muscles: ['triceps'],                             tips: ['Hands form a diamond shape under chest', 'Elbows track back, not out', 'Full range of motion'] },
  'Kickback':               { muscles: ['triceps'],                             tips: ['Torso nearly parallel to floor', 'Upper arm stays parallel to floor throughout', 'Squeeze at full extension'] },

  'Crunch':                 { muscles: ['abs'],                                 tips: ['Curl shoulders off floor — not a sit-up', 'Exhale hard and squeeze at top', 'Hands behind ears, not pulling on neck'] },
  'Plank':                  { muscles: ['abs', 'obliques'],                     tips: ['Straight line from head to heel', 'Hips neither sagging nor raised', 'Breathe steadily — brace like you\'re about to get punched'] },
  'Leg Raise':              { muscles: ['abs'],                                 tips: ['Flatten lower back into bench', 'Control the descent — do not let legs drop', 'Slightly bent knees if hamstrings are tight'] },
  'Cable Crunch':           { muscles: ['abs'],                                 tips: ['Hinge from hips, not just neck', 'Round the spine to crunch abs', 'Keep hips stationary — movement is in the trunk'] },
  'Ab Wheel':               { muscles: ['abs'],                                 tips: ['Start on knees, progress to standing', 'Keep core braced as you roll out', 'Go only as far as you can without your hips dropping'] },
  'Hanging Leg Raise':      { muscles: ['abs'],                                 tips: ['Control the swing — no kipping', 'Round lower back slightly at top for full ab contraction', 'Lower legs slowly'] },
  'Mountain Climbers':      { muscles: ['abs', 'obliques'],                     tips: ['Hips stay level — do not bounce', 'Drive knee toward opposite elbow for oblique emphasis', 'Maintain plank position throughout'] },

  'Russian Twist':          { muscles: ['obliques'],                            tips: ['Lift feet off floor for more difficulty', 'Rotate from the torso — not just arms', 'Touch weight to floor each side'] },
  'Wood Chop':              { muscles: ['obliques'],                            tips: ['Rotate from the core, not just arms', 'Keep hips square — movement is in torso', 'Controlled speed — no yanking the cable'] },
  'Side Plank':             { muscles: ['obliques'],                            tips: ['Straight line from head to feet', 'Stack or stagger feet', 'Raise top arm overhead for more challenge'] },
  'Oblique Crunch':         { muscles: ['obliques'],                            tips: ['Elbow toward hip on the same side', 'Do not pull neck — focus on side crunch', 'Full squeeze at top'] },
  'Bicycle Crunch':         { muscles: ['abs', 'obliques'],                     tips: ['Slow and controlled beats fast and sloppy', 'Rotate shoulder to knee — not elbow', 'Keep lower back pressed down'] },

  'Squat':                  { muscles: ['quads', 'glutes', 'hamstrings'],       tips: ['Feet shoulder-width, toes slightly out', 'Knees track over toes — do not cave in', 'Break parallel for full depth'] },
  'Leg Press':              { muscles: ['quads', 'glutes'],                     tips: ['Do not lock knees at top', 'Foot position: high = more glutes, low = more quads', 'Control the sled on the way down'] },
  'Leg Extension':          { muscles: ['quads'],                               tips: ['Full extension at top — squeeze quads hard', 'Control the negative slowly', 'Toes pointed slightly out for more sweep activation'] },
  'Lunges':                 { muscles: ['quads', 'glutes'],                     tips: ['Front knee stays over ankle, not past toes', 'Back knee nearly touches floor', 'Keep torso upright'] },
  'Bulgarian Split Squat':  { muscles: ['quads', 'glutes'],                     tips: ['Rear foot elevated on bench', 'Front foot far enough forward that knee tracks over toes', 'Hardest quad exercise — start light'] },
  'Hack Squat':             { muscles: ['quads'],                               tips: ['Feet low on plate = more quad emphasis', 'Full depth — thighs past parallel', 'Do not round lower back at the bottom'] },

  'Barbell Shrug':          { muscles: ['upper_back'],                          tips: ['Pull straight up — no rolling of shoulders', 'Hold at top for 1 second squeeze', 'Full stretch at bottom'] },
  'Dumbbell Shrug':         { muscles: ['upper_back'],                          tips: ['Hold peak contraction for 1–2 seconds', 'Keep arms straight throughout', 'Avoid rolling motion'] },
  'Rack Pull':              { muscles: ['upper_back', 'lower_back'],            tips: ['Start from just below knee height', 'Drive hips forward at top', 'Overhand or mixed grip'] },
  'Bent-Over Lateral Raise':{ muscles: ['upper_back', 'shoulders'],             tips: ['Hinge forward at 45°', 'Lead with elbows, not hands', 'Squeeze rear delts at top'] },

  'Lat Pulldown':           { muscles: ['lats', 'biceps'],                      tips: ['Pull bar to upper chest — not behind head', 'Lean back slightly and drive elbows to hips', 'Full stretch at top on every rep'] },
  'Pull-Up':                { muscles: ['lats', 'biceps'],                      tips: ['Full hang at bottom every rep', 'Drive elbows down and back to engage lats', 'Chest to bar, not just chin'] },
  'Seated Cable Row':       { muscles: ['lats', 'upper_back'],                  tips: ['Keep torso upright — do not lean back excessively', 'Squeeze shoulder blades together at end', 'Full stretch forward on each rep'] },
  'Bent-Over Row':          { muscles: ['lats', 'upper_back'],                  tips: ['Hinge to ~45°, back flat', 'Pull to lower chest/belly button', 'Drive elbows back, not out'] },
  'Single Arm Row':         { muscles: ['lats'],                                tips: ['Brace on bench with free hand', 'Pull elbow to hip — think "starting a lawn mower"', 'Full stretch at bottom'] },
  'Straight Arm Pulldown':  { muscles: ['lats'],                                tips: ['Arms straight throughout — isolates lats', 'Drive hands down to thighs', 'Squeeze at bottom'] },

  'Deadlift':               { muscles: ['lower_back', 'glutes', 'hamstrings'],  tips: ['Bar stays over mid-foot throughout', 'Drive the floor away — do not yank the bar', 'Lock hips and knees simultaneously at top'] },
  'Romanian Deadlift':      { muscles: ['hamstrings', 'glutes', 'lower_back'],  tips: ['Slight knee bend — hinge is at the hips', 'Bar drags down your legs to mid-shin', 'Stretch hamstrings, not lower back'] },
  'Back Extension':         { muscles: ['lower_back', 'glutes'],                tips: ['Squeeze glutes at top — do not hyperextend', 'Can hold a plate for added resistance', 'Controlled tempo — 2 seconds each way'] },
  'Bird Dog':               { muscles: ['lower_back', 'abs'],                   tips: ['Opposite arm and leg extend simultaneously', 'Keep hips level — do not rotate', 'Pause at full extension before lowering'] },
  'Superman':               { muscles: ['lower_back', 'glutes'],                tips: ['Lift arms and legs simultaneously', 'Hold at top for 2 seconds', 'Focus on squeezing glutes'] },
  'Good Morning':           { muscles: ['lower_back', 'hamstrings'],            tips: ['Bar on upper back like a squat', 'Hinge at hips with slight knee bend', 'Keep back flat throughout'] },

  'Hip Thrust':             { muscles: ['glutes'],                              tips: ['Shoulders on bench, bar over hip crease', 'Drive through heels, squeeze glutes hard at top', 'Full hip extension — do not cut range of motion'] },
  'Glute Bridge':           { muscles: ['glutes'],                              tips: ['Floor version of hip thrust', 'Feet flat, drive hips up and squeeze', 'Pause at top for 2 seconds'] },
  'Kettlebell Swing':       { muscles: ['glutes', 'hamstrings'],                tips: ['Hip hinge — not a squat', 'Power comes from hip snap, not arms', 'Bell floats to shoulder height from momentum'] },
  'Sumo Deadlift':          { muscles: ['glutes', 'quads', 'lower_back'],       tips: ['Wide stance, toes pointed out 45°', 'Grip inside legs, knees track over toes', 'More glute and adductor emphasis than conventional'] },
  'Cable Kickback':         { muscles: ['glutes'],                              tips: ['Slight forward lean on cable machine', 'Squeeze glute at full extension', 'Do not swing — slow and controlled'] },
  'Step-Up':                { muscles: ['glutes', 'quads'],                     tips: ['Drive through the heel of the stepping leg', 'Do not push off the trailing leg', 'Tall box = more glute, shorter = more quad'] },

  'Leg Curl':               { muscles: ['hamstrings'],                          tips: ['Full extension at start of each rep', 'Curl all the way — touch pad to glutes if possible', 'Control the negative — do not let weight crash'] },
  'Lying Leg Curl':         { muscles: ['hamstrings'],                          tips: ['Hips stay flat on pad', 'Curl all the way to glutes', 'Slow negative for maximum tension'] },
  'Nordic Curl':            { muscles: ['hamstrings'],                          tips: ['Ankles anchored, lower body toward floor slowly', 'One of the hardest hamstring exercises — use assistance at first', 'Catch yourself with hands, push back up'] },
  'Stiff-Leg Deadlift':     { muscles: ['hamstrings', 'lower_back'],            tips: ['Legs nearly straight — not locked', 'Feel hamstring stretch at bottom', 'Keep bar close to shins'] },

  'Standing Calf Raise':    { muscles: ['calves'],                              tips: ['Full stretch at bottom — heel below platform', 'Pause at top and squeeze hard', 'High reps work well: 15–25 per set'] },
  'Seated Calf Raise':      { muscles: ['calves'],                              tips: ['Targets soleus (lower calf) more than standing', 'Full range of motion essential', 'Slow and controlled'] },
  'Donkey Calf Raise':      { muscles: ['calves'],                              tips: ['Hinged position places more stretch on calf', 'Full range of motion', 'Add weight on hips for progression'] },
  'Box Jump':               { muscles: ['calves', 'quads', 'glutes'],           tips: ['Land softly — absorb impact through hips and knees', 'Full hip extension at takeoff', 'Step down — do not jump down repeatedly'] },
  'Jump Rope':              { muscles: ['calves'],                              tips: ['Stay on balls of feet throughout', 'Small jumps — just enough clearance for the rope', 'Wrists do the spinning, not arms'] },
  'Single-Leg Calf Raise':  { muscles: ['calves'],                              tips: ['Hang free leg for balance challenge', 'Full stretch at bottom every rep', 'Add weight when 20+ reps becomes easy'] },
};

export function openTutorial(exerciseName) {
  const query = encodeURIComponent(exerciseName + ' exercise form tutorial');
  Linking.openURL('https://www.youtube.com/results?search_query=' + query);
}
