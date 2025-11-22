const { data, error } = await supabase
  .from('race_questions')
  .select('*')
  .limit(5);

console.log('SUPABASE QUESTIONS:', data, error);
