import { supabase } from "./client";

// Sign up with email
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  return { data, error };
}

// Sign in with email
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  return { data, error };
}

// Sign in with GitHub
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: window.location.origin },
  });
  return { data, error };
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current user
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Auth state listener
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

