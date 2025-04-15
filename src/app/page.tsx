'use client'
import { useState, useRef, useEffect, ChangeEvent, FormEvent, JSX } from 'react';

// Type definitions remain the same
interface BaseInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  name?: string;
  className?: string;
}

interface InputProps extends BaseInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends BaseInputProps {
  options: Option[];
  value?: string;
  onChange: (e: { target: { name?: string; value: string } }) => void;
  placeholder?: string;
  enableSearch?: boolean;
}

interface TextareaProps extends BaseInputProps {
  placeholder?: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  resizable?: boolean;
}

interface CheckboxProps extends BaseInputProps {
  checked?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface RadioGroupProps extends BaseInputProps {
  options: Option[];
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface ToggleProps extends BaseInputProps {
  checked?: boolean;
  onChange: (e: { target: { name?: string; type: string; checked: boolean } }) => void;
}

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isValid?: boolean;
  className?: string;
}

// Updated FormData to include new fields
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  gender: string;
  role: string;
  rememberMe: boolean;
  acceptTerms: boolean;
  bio: string;
  interests: string[];
  marketingPreferences: string;
}

interface FormErrors {
  [key: string]: string;
}

// All component definitions remain unchanged
export const Input = ({ 
  label, 
  type = 'text', 
  placeholder = '', 
  required = false, 
  error = '', 
  name,
  value,
  onChange,
  className = ''
}: InputProps): JSX.Element => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const Select = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select an option', 
  required = false, 
  error = '',
  enableSearch = false,
  name,
  className = ''
}: SelectProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const selectRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = enableSearch 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-4 relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!selectedOption ? 'text-gray-400' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {enableSearch && (
            <div className="sticky top-0 p-2 border-b bg-white">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}
          <ul className="max-h-60 overflow-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                    option.value === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    onChange({ target: { name, value: option.value } });
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 text-center">No options found</li>
            )}
          </ul>
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const Textarea = ({ 
  label, 
  placeholder = '', 
  required = false, 
  error = '', 
  name,
  value,
  onChange,
  maxLength,
  resizable = true,
  className = ''
}: TextareaProps): JSX.Element => {
  const charCount = value?.length || 0;
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${resizable ? '' : 'resize-none'} ${className}`}
      />
      {maxLength && (
        <p className="mt-1 text-sm text-gray-500 text-right">
          {charCount}/{maxLength}
        </p>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const Checkbox = ({ 
  label, 
  checked = false, 
  onChange, 
  name,
  className = '',
  error = ''
}: CheckboxProps): JSX.Element => {
  return (
    <div className="mb-4 flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${className}`}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor={name} className="text-gray-700">
            {label}
          </label>
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};

// New CheckboxGroup component
export const CheckboxGroup = ({ 
  label, 
  options = [], 
  value = [], 
  onChange, 
  name,
  required = false,
  error = '',
  className = ''
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value: optionValue } = e.target;
    
    let newValues: string[];
    if (checked) {
      newValues = [...value, optionValue];
    } else {
      newValues = value.filter(v => v !== optionValue);
    }
    
    // Simulate onChange event with array value
    onChange({ 
      target: { 
        name, 
        value: newValues,
        type: 'checkbox'
      } 
    });
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={className}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const RadioGroup = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  name,
  required = false,
  error = '',
  className = ''
}: RadioGroupProps): JSX.Element => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={className}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center mb-1">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const Toggle = ({ 
  label, 
  checked = false, 
  onChange, 
  name,
  className = ''
}: ToggleProps): JSX.Element => {
  const handleToggle = () => {
    const event = {
      target: {
        name,
        type: 'checkbox',
        checked: !checked
      }
    };
    onChange(event);
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <label className="ml-3 text-sm text-gray-700">{label}</label>
      )}
    </div>
  );
};

export const Form = ({ 
  children, 
  onSubmit, 
  isValid = true,
  className = ''
}: FormProps): JSX.Element => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid && onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

// Enhanced Login System
export default function LoginSystem(): JSX.Element {
  const [formType, setFormType] = useState<'login' | 'register' | 'forgot'>('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    role: 'user',
    rememberMe: false,
    acceptTerms: false,
    bio: '',
    interests: [],
    marketingPreferences: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: string | string[]; type?: string; checked?: boolean } }) => {
    const { name, value, type, checked } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' && typeof checked !== 'undefined' ? checked : value
      });
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation for login and register
    if (formType !== 'forgot' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formType === 'register' && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (formType === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Name validation for register
    if (formType === 'register' && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    // Gender validation for register
    if (formType === 'register' && !formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    // Terms checkbox for register
    if (formType === 'register' && !formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Here you would typically make an API call
      alert(`${formType.charAt(0).toUpperCase() + formType.slice(1)} successful!`);
    }
  };

  // Options for various form components
  const roleOptions: Option[] = [
    { value: 'user', label: 'Regular User' },
    { value: 'admin', label: 'Administrator' },
    { value: 'editor', label: 'Content Editor' }
  ];
  
  const genderOptions: Option[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];
  
  const interestOptions: Option[] = [
    { value: 'technology', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'art', label: 'Art' },
    { value: 'science', label: 'Science' }
  ];
  
  const marketingOptions: Option[] = [
    { value: 'email', label: 'Email newsletters' },
    { value: 'sms', label: 'SMS notifications' },
    { value: 'none', label: 'No marketing' }
  ];

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements remain unchanged */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-300 rounded-full opacity-20 -mt-20 -mr-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full opacity-20 -mb-20 -ml-20" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-300 rounded-full opacity-10" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-300 rounded-full opacity-10" />
      
      <div className="absolute inset-0 z-0 opacity-5">
        <img src="/api/placeholder/1920/1080" alt="background pattern" className="w-full h-full object-cover" />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {formType === 'login' && 'Welcome Back'}
            {formType === 'register' && 'Join Our Community'}
            {formType === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            {formType === 'login' && 'Sign in to access your account'}
            {formType === 'register' && 'Create an account to get started'}
            {formType === 'forgot' && 'Enter your email to receive reset instructions'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 transition-all duration-300 hover:shadow-xl">
          <Form onSubmit={handleSubmit} isValid={isFormValid} className="space-y-6">
            {/* Email field (used in all forms) */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
              placeholder="your.email@example.com"
            />
            
            {/* Password field (login and register) */}
            {formType !== 'forgot' && (
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
                placeholder="Enter your password"
              />
            )}
            
            {/* Additional register fields */}
            {formType === 'register' && (
              <>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                />
                
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={errors.name}
                  placeholder="John Doe"
                />
                
                {/* New Gender Selection */}
                <RadioGroup
                  label="Gender"
                  name="gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  error={errors.gender}
                  className="grid grid-cols-2 sm:grid-cols-2"
                />
                
                <Select
                  label="Role"
                  name="role"
                  options={roleOptions}
                  value={formData.role}
                  onChange={handleChange}
                  enableSearch
                />
                
                {/* New Interests Checkboxes */}
                <CheckboxGroup
                  label="Interests"
                  name="interests"
                  options={interestOptions}
                  value={formData.interests}
                  onChange={handleChange}
                  className="grid grid-cols-2 sm:grid-cols-3"
                />
                
                {/* New Marketing Preferences */}
                <RadioGroup
                  label="Marketing Preferences"
                  name="marketingPreferences"
                  options={marketingOptions}
                  value={formData.marketingPreferences}
                  onChange={handleChange}
                />
                
                <Textarea
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  maxLength={150}
                />
                
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  label="I accept the terms and conditions"
                  error={errors.acceptTerms}
                />
              </>
            )}
            
            {/* Remember me (login only) */}
            {formType === 'login' && (
              <div className="flex items-center justify-between">
                <Toggle
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  label="Remember me"
                />
                
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setFormType('forgot')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isFormValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {formType === 'login' && 'Sign in'}
                {formType === 'register' && 'Create account'}
                {formType === 'forgot' && 'Reset password'}
              </button>
            </div>
            
            {/* Social login options */}
            {formType !== 'forgot' && (
              <div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Form type switcher */}
            <div className="text-sm text-center mt-6">
              {formType === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('register');
                      setErrors({});
                    }}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </button>
                </p>
              )}
              
              {formType === 'register' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('login');
                      setErrors({});
                    }}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </button>
                </p>
              )}
              
              {formType === 'forgot' && (
                <p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('login');
                      setErrors({});
                    }}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Back to login
                  </button>
                </p>
              )}
            </div>
          </Form>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By using this service, you agree to our <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a> and <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a>.</p>
        </div>
      </div>
      
      {/* Toast notification for success/error messages */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* This would be conditionally rendered based on form submission state */}
        {/* 
        <div className="bg-green-50 p-4 rounded-md shadow-lg border border-green-200 flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Successfully logged in!
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button className="inline-flex text-gray-400 hover:text-gray-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}