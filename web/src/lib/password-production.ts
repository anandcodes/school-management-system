/**
 * Password Hashing Utility - PRODUCTION VERSION
 * 
 * This version uses bcryptjs for secure password hashing.
 * Make sure to install: npm install bcryptjs @types/bcryptjs
 */

import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password with salt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
    if (!password || password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }

    if (password.length > 128) {
        return { valid: false, message: 'Password is too long (max 128 characters)' };
    }

    // Optional: Add more validation rules for production
    // Uncomment these for stricter password requirements:

    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumber = /[0-9]/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    //     return { 
    //         valid: false, 
    //         message: 'Password must contain uppercase, lowercase, and numbers' 
    //     };
    // }

    return { valid: true, message: 'Password is valid' };
}

/**
 * Check if a password is already hashed
 * Useful for migration from plain text to hashed passwords
 * @param password - Password string to check
 * @returns True if password appears to be a bcrypt hash
 */
export function isPasswordHashed(password: string): boolean {
    // Bcrypt hashes start with $2a$, $2b$, or $2y$
    return /^\$2[aby]\$\d{2}\$/.test(password);
}
