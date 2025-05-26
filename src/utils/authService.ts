
export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
}

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    this.authState.isLoading = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const user: User = {
        id: 'user-123',
        email: credentials.email,
        name: 'Demo User',
        plan: 'pro',
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      this.authState = {
        user,
        isAuthenticated: true,
        isLoading: false,
        token: 'mock-jwt-token'
      };

      // Store in localStorage
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      this.authState.isLoading = false;
      return { success: false, error: 'Login failed' };
    }
  }

  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    this.authState.isLoading = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const user: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        company: data.company,
        plan: 'free',
        createdAt: new Date()
      };

      this.authState = {
        user,
        isAuthenticated: true,
        isLoading: false,
        token: 'mock-jwt-token'
      };

      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      this.authState.isLoading = false;
      return { success: false, error: 'Registration failed' };
    }
  }

  async logout(): Promise<void> {
    this.authState = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  async checkAuthStatus(): Promise<boolean> {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState = {
          user,
          isAuthenticated: true,
          isLoading: false,
          token
        };
        return true;
      } catch {
        this.logout();
        return false;
      }
    }

    return false;
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getToken(): string | undefined {
    return this.authState.token;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!this.authState.user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const updatedUser = { ...this.authState.user, ...updates };
      this.authState.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.authState.user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password change
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Password change failed' };
    }
  }
}

export const authService = AuthService.getInstance();
