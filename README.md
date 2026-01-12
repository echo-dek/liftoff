# Liftoff

A very simple application for recording progress with strength training.  

## Getting started

Tap "Start".  

You will see today's date, plus today's exercises.  If you need to, you can override the date, then, when you're ready, you tap the first exercise.  Depending upon the exercise, Liftoff may ask you to confirm the weight you are using.  As you complete each set tap "Complete" and the number of remaining sets will count down.  When all the sets are completed, you will move on to the next exercise, and so on, until your day's work is completed.  

Simple.

And next time you do the same exercise, the weight you used will be remembered from last time and then _incremented_ (by 1kg or 2.5lb depending upon your preferred units).  Progressive overload out of the box.  

## Configuration

By default, Liftoff is preloaded with a simple set of exercises.  

Exercises are organised into phases, with each phases split into one or more days.  Each day is then broken down into a series of exercises and each exercise has a required number of sets and reps.  

You can add in extra phases, add or remove days from each phase and add, edit or remove exercises from each individual day.  

### The default set of exercises

#### Phase One

Day 1:
- Overhead Press: 3 sets of 8 reps (no weight recorded)
- Bodyweight Squat: 3 sets of 10 reps (no weight recorded)
- Incline Pushup: 3 sets of 8 reps (no weight recorded)
- Hip Hinge: 3 sets of 8 reps (no weight recorded)
- Bent over Row: 3 sets of 8 reps (no weight recorded)

#### Phase Two

Day 1:
- Dumbell Squat: 5 sets of 5 reps (weight recorded)
- Dumbell Bench: 5 sets of 5 reps (weight recorded)
- Dumbell Row: 3 sets of 8 reps (weight recorded)

Day 2:
- Dumbell RDL: 5 sets of 5 reps (weight recorded)
- Dumbell OHP: 3 sets of 5 reps (weight recorded)
- Lat Pulldown: 3 sets of 8 reps (weight recorded)

#### Phase Three

Day 1:
- Barbell Squat: 5 sets of 5 reps (weight recorded)
- Bench: 5 sets of 5 reps (weight recorded)
- Bent over Row: 3 sets of 8 reps (weight recorded)

Day 2:
- Barbell Deadlift: 3 sets of 5 reps (weight recorded)
- Overhead Press: 3 sets of 5 reps (weight recorded)
- Lat Pulldown: 3 sets of 8 reps (weight recorded)

## Technical Details

This is a "Progressive Web App", written using a tool called Sveltekit, which keeps all its data in local storage.  This means that once it has been loaded, everything runs completely on your device - no data is ever shared with anyone else.  It will also run completely offline, so you can track your progress even if you can't get a signal.  
