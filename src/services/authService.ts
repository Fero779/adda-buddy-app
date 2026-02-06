/**
 * Auth Service - Abstracted API layer for authentication
 * 
 * This service handles all authentication-related API calls.
 * Replace the stub implementations with actual API endpoints when ready.
 */

import { supabase } from '@/integrations/supabase/client';

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  // Debug only - remove in production
  debug_otp?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  error?: string;
  isNewUser?: boolean;
  user?: {
    id: string;
    email: string;
    phone?: string;
    role: 'teacher' | 'influencer' | null;
    onboarded: boolean;
    name: string | null;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  role: 'teacher' | 'influencer' | null;
  onboarded: boolean;
  name: string | null;
}

/**
 * Send OTP to user's email and registered phone number
 * @param email - User's email address
 * @returns Promise with success/failure response
 */
export const sendOtp = async (email: string): Promise<SendOtpResponse> => {
  try {
    // TODO: Replace with actual API endpoint
    // The backend should:
    // 1. Look up the phone number registered to this email
    // 2. Generate a single OTP
    // 3. Send OTP to both email and phone
    // 4. Return success/failure
    
    const { data, error } = await supabase.functions.invoke('send-otp-email', {
      body: { email: email.toLowerCase().trim() }
    });

    if (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }

    return {
      success: data.success,
      message: data.message,
      error: data.error,
      debug_otp: data.debug_otp // Remove in production
    };
  } catch (error: any) {
    console.error('Send OTP exception:', error);
    return {
      success: false,
      error: error.message || 'Network error. Please try again.'
    };
  }
};

/**
 * Verify OTP entered by user
 * @param email - User's email address
 * @param otp - 6-digit OTP code
 * @returns Promise with user data and session on success
 */
export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    // TODO: Replace with actual API endpoint
    // The backend should:
    // 1. Validate OTP against stored value
    // 2. Create/update user session
    // 3. Return user profile and auth tokens
    
    const { data, error } = await supabase.functions.invoke('verify-otp-email', {
      body: { 
        email: email.toLowerCase().trim(),
        otp: otp.trim()
      }
    });

    if (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify OTP'
      };
    }

    return {
      success: data.success,
      error: data.error,
      isNewUser: data.isNewUser,
      user: data.user,
      session: data.session
    };
  } catch (error: any) {
    console.error('Verify OTP exception:', error);
    return {
      success: false,
      error: error.message || 'Network error. Please try again.'
    };
  }
};

/**
 * Set Supabase session from tokens
 * @param accessToken - JWT access token
 * @param refreshToken - Refresh token
 */
export const setAuthSession = async (accessToken: string, refreshToken: string) => {
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (error) {
    console.error('Set session error:', error);
    throw new Error('Failed to establish session');
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Sign out user
 */
export const signOut = async () => {
  await supabase.auth.signOut();
  sessionStorage.clear();
  localStorage.removeItem('auth_email');
};

/**
 * Email validation helper
 * @param email - Email to validate
 * @returns boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};
