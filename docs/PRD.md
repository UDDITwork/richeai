# RICHIEAT - Product Requirements Document (PRD)
## JavaScript + React (Vite) + Tailwind CSS Implementation

## 1. Executive Summary

### 1.1 Product Overview
RICHIEAT is a modern web-based platform for financial advisors to manage client relationships, built with React (Vite), Tailwind CSS, and the MERN stack. The platform streamlines advisor registration, client onboarding, and portfolio management through an intuitive dashboard interface.

### 1.2 Core Objectives
- Fast, responsive SPA using Vite's development environment
- Modern UI with Tailwind CSS utility-first approach
- Seamless advisor-client relationship management
- Secure document handling and financial planning
- SEBI compliance and regulatory adherence

### 1.3 Target Audience
- **Primary:** SEBI-registered financial advisors in India
- **Secondary:** Clients seeking professional financial advisory

## 2. Technical Architecture

### 2.1 Frontend Stack
```javascript
// Frontend Technologies
- Build Tool: Vite 5.0+
- Framework: React 18+ (JavaScript)
- Styling: Tailwind CSS 3.4+
- UI Components: Shadcn/UI + Radix UI
- Routing: React Router v6
- State Management: Context API + useReducer
- HTTP Client: Axios
- Form Handling: React Hook Form
- Component Variants: Class Variance Authority (CVA)
- Icons: Heroicons / Lucide React
- Charts: Recharts / Chart.js
- Date Handling: date-fns
- Animations: Framer Motion
```

### 2.2 Backend Stack
```javascript
// Backend Technologies
- Runtime: Node.js 20 LTS
- Framework: Express.js 4.18+
- Database: MongoDB 6.0+
- ODM: Mongoose 8.0+
- Authentication: JWT + bcrypt
- File Upload: Multer + AWS S3
- Email: Nodemailer
- Validation: Joi / Express Validator
- CORS: cors middleware
- Environment: dotenv
```

### 2.3 Development Setup
```bash
# Project Structure
richieat/
├── client/                    # React Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helper functions
│   │   ├── services/        # API services
│   │   ├── context/         # Context providers
│   │   ├── assets/          # Images, fonts
│   │   └── styles/          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                   # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── server.js
└── package.json
```

### 2.4 Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### 2.5 Tailwind Configuration
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## 3. Component Architecture

### 3.1 Core Components Structure
```javascript
// Component hierarchy
src/components/
├── common/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Modal.jsx
│   ├── Toast.jsx
│   ├── Spinner.jsx
│   └── Card.jsx
├── layout/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── Footer.jsx
│   └── Layout.jsx
├── auth/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── ForgotPassword.jsx
│   └── ProtectedRoute.jsx
├── dashboard/
│   ├── DashboardStats.jsx
│   ├── ClientList.jsx
│   ├── RecentActivity.jsx
│   └── QuickActions.jsx
└── client/
    ├── ClientCard.jsx
    ├── ClientDetails.jsx
    ├── AddClientModal.jsx
    └── OnboardingForm.jsx
```

### 3.2 Shadcn/UI Integration
```javascript
// Using Shadcn/UI Button Component
import { Button } from "@/components/ui/button"

// Basic Usage Examples
<Button variant="default">Default Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// Size Variants
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">⚙️</Button>

// RICHIEAT Specific Examples
<Button variant="default">Register as Advisor</Button>
<Button variant="outline">Add Client</Button>
<Button variant="secondary">Save Profile</Button>
<Button variant="destructive">Delete Client</Button>
```

### 3.3 Shadcn/UI Configuration
```javascript
// components.json - Shadcn/UI Configuration
{
  "style": "default",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 3.4 Custom Button Component (Alternative)
```javascript
// Custom Button.jsx - Alternative implementation
import { Button as ShadcnButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </ShadcnButton>
  )
}

export default Button
```

## 4. Feature Implementation

### 4.1 Advisor Registration Module

#### 4.1.1 Registration Form Component
```javascript
// RegisterForm.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Input from '../common/Input'
import Button from '../common/Button'

const RegisterForm = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  
  const onSubmit = async (data) => {
    if (step === 1) {
      setStep(2)
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.post('/api/auth/register', data)
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register as Advisor
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="flex items-center">
              <div className={`h-8 w-8 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-300'} text-white flex items-center justify-center`}>
                1
              </div>
              <div className={`h-1 w-24 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
              <div className={`h-8 w-8 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'} text-white flex items-center justify-center`}>
                2
              </div>
            </div>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 ? (
            <>
              <div className="space-y-4">
                <Input
                  label="First Name"
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Last Name"
                  type="text"
                  {...register('lastName')}
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                />
                <Input
                  label="Password"
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  error={errors.password?.message}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Continue
              </Button>
              
              <div className="text-center">
                <span className="text-gray-600">or</span>
                <button
                  type="button"
                  className="mt-2 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img className="h-5 w-5 mr-2" src="/google.svg" alt="Google" />
                  Sign up with Google
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <Input
                  label="PPM Name"
                  type="text"
                  {...register('ppmName', { required: 'PPM Name is required' })}
                  error={errors.ppmName?.message}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  {...register('phoneNumber', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit phone number'
                    }
                  })}
                  error={errors.phoneNumber?.message}
                />
                <Input
                  label="SEBI Registration Number"
                  type="text"
                  {...register('sebiRegNumber', { required: 'SEBI Registration is required' })}
                  error={errors.sebiRegNumber?.message}
                />
                <Input
                  label="PPB Number"
                  type="text"
                  {...register('ppbNumber', { required: 'PPB Number is required' })}
                  error={errors.ppbNumber?.message}
                />
                <Input
                  label="ARN Number"
                  type="text"
                  {...register('arnNumber', { required: 'ARN Number is required' })}
                  error={errors.arnNumber?.message}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  Save and Proceed
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
```

### 4.2 Dashboard Implementation

#### 4.2.1 Dashboard Layout
```javascript
// DashboardLayout.jsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
```

#### 4.2.2 Dashboard Stats Component
```javascript
// DashboardStats.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { UserGroupIcon, DocumentTextIcon, CurrencyRupeeIcon, ClockIcon } from '@heroicons/react/24/outline'

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPlans: 0,
    monthlyRevenue: 0,
    pendingOnboardings: 0
  })
  
  useEffect(() => {
    fetchStats()
  }, [])
  
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/advisor/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }
  
  const statCards = [
    {
      name: 'Total Active Clients',
      value: stats.totalClients,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Financial Plans',
      value: stats.totalPlans,
      icon: DocumentTextIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'Pending Onboardings',
      value: stats.pendingOnboardings,
      icon: ClockIcon,
      color: 'bg-yellow-500'
    }
  ]
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats
```

### 4.3 Client Management Module

#### 4.3.1 Client List Component
```javascript
// ClientList.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import Button from '../common/Button'
import AddClientModal from './AddClientModal'

const ClientList = () => {
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchClients()
  }, [])
  
  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      setClients(response.data)
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredClients = clients.filter(client =>
    client.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your clients including their name, email, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Client
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added On
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No clients found
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {client.personalInfo.firstName} {client.personalInfo.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{client.personalInfo.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                            ${client.onboardingStatus === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : client.onboardingStatus === 'invited'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}>
                            {client.onboardingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <AddClientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false)
          fetchClients()
        }}
      />
    </div>
  )
}

export default ClientList
```

#### 4.3.2 Add Client Modal
```javascript
// AddClientModal.jsx
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Input from '../common/Input'
import Button from '../common/Button'

const AddClientModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post('/api/clients/invite', data)
      reset()
      onSuccess()
    } catch (error) {
      console.error('Failed to invite client:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Add New Client
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Enter client details to send an onboarding invitation
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                      <Input
                        label="Client Name"
                        type="text"
                        {...register('name', { required: 'Client name is required' })}
                        error={errors.name?.message}
                      />
                      
                      <Input
                        label="Client Email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        error={errors.email?.message}
                      />
                      
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <Button
                          type="submit"
                          loading={loading}
                          className="w-full sm:ml-3 sm:w-auto"
                        >
                          Send Invitation
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={onClose}
                          className="mt-3 w-full sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default AddClientModal
```

## 5. API Service Layer

### 5.1 Axios Configuration
```javascript
// services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### 5.2 API Service Methods
```javascript
// services/authService.js
import api from './api'

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
}

// services/advisorService.js
export const advisorService = {
  getProfile: () => api.get('/advisor/profile'),
  updateProfile: (data) => api.put('/advisor/profile', data),
  getDashboard: () => api.get('/advisor/dashboard'),
  uploadPicture: (file) => {
    const formData = new FormData()
    formData.append('picture', file)
    return api.post('/advisor/upload-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

// services/clientService.js
export const clientService = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  invite: (data) => api.post('/clients/invite', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
}
```

## 6. State Management

### 6.1 Auth Context
```javascript
// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await authService.getProfile()
        setUser(response.data)
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }
  
  const login = async (credentials) => {
    const response = await authService.login(credentials)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
    return response.data
  }
  
  const logout = async () => {
    await authService.logout()
    localStorage.removeItem('token')
    setUser(null)
  }
  
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

## 7. Routing Configuration

### 7.1 App Routes
```javascript
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetails from './pages/ClientDetails'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
```

## 8. Backend Models

### 8.1 Mongoose Schemas
```javascript
// models/Advisor.js
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const advisorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  professionalDetails: {
    ppmName: String,
    phoneNumber: String,
    sebiRegNumber: String,
    ppbNumber: String,
    arnNumber: String,
    address: String,
    experience: Number
  },
  profilePicture: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
})

advisorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

advisorSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('Advisor', advisorSchema)
```

## 9. Testing Strategy

### 9.1 Unit Testing Setup
```javascript
// Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../components/common/Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  test('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  test('shows loading state', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## 10. Deployment Configuration

### 10.1 Environment Variables
```bash
# .env.example
# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/richieat
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=richieat-assets
```

### 10.2 Docker Configuration
```dockerfile
# Dockerfile - Frontend
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 11. Performance Optimization

### 11.1 Code Splitting
```javascript
// Lazy loading routes
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Clients = lazy(() => import('./pages/Clients'))

// In routes
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/clients" element={<Clients />} />
  </Routes>
</Suspense>
```

### 11.2 Image Optimization
```javascript
// Use next-gen image formats
<picture>
  <source srcSet="/logo.webp" type="image/webp" />
  <img src="/logo.png" alt="RICHIEAT Logo" className="h-8 w-auto" />
</picture>
```

## 12. Security Best Practices

### 12.1 Input Sanitization
```javascript
// Backend validation middleware
const { body, validationResult } = require('express-validator')

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
  body('firstName').trim().escape().notEmpty(),
  body('phoneNumber').matches(/^[0-9]{10}$/),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
```

### 12.2 Rate Limiting
```javascript
// Rate limiting configuration
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
})

app.post('/api/auth/login', loginLimiter, loginController)
```

---

**Document Version:** 2.0  
**Technology Stack:** JavaScript + React (Vite) + Tailwind CSS + MERN  
**Last Updated:** [Current Date]  
**Status:** Implementation Ready