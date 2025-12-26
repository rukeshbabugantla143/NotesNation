
import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Stethoscope, 
  Thermometer, 
  Library 
} from 'lucide-react';
import { StreamType } from './types';

export const STREAMS: { id: StreamType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'Engineering', label: 'Engineering', icon: <GraduationCap />, color: 'bg-blue-600' },
  { id: 'Degree', label: 'Degree', icon: <BookOpen />, color: 'bg-green-600' },
  { id: 'Medical', label: 'Medical', icon: <Stethoscope />, color: 'bg-red-600' },
  { id: 'Nursing & Pharmacy', label: 'Nursing & Pharmacy', icon: <Thermometer />, color: 'bg-purple-600' },
  { id: 'Intermediate', label: 'Intermediate', icon: <Library />, color: 'bg-yellow-600' },
];

export const STATES = ['AP', 'TS'] as const;

export const MATERIAL_TYPES = [
  'Exam Papers',
  'Notes',
  'Textbooks',
  'Assignments',
  'Lab Records',
  'Practical Records',
  'Case Studies',
  'Viva Questions',
  'Important Questions',
  'Bit Banks',
  'Drug Charts'
];

export const HIERARCHY = {
  Engineering: {
    courses: ['Diploma', 'B.Tech'],
    regulations: {
      Diploma: { AP: ['C16', 'C20', 'C23'], TS: ['C18', 'C21', 'C24'] },
      'B.Tech': { AP: ['R16', 'R19', 'R20', 'R23'], TS: ['R16', 'R18', 'R22', 'R23'] }
    },
    branches: ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'IT'],
    semesters: {
      Diploma: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
      'B.Tech': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']
    }
  },
  Degree: {
    courses: ['B.Sc', 'B.Com', 'B.A'],
    regulations: ['CBCS', 'R21', 'R22'],
    groups: {
      'B.Sc': ['MPC', 'MSCS', 'CBZ'],
      'B.Com': ['General', 'Computers'],
      'B.A': ['History', 'Economics', 'Political Science']
    },
    semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6']
  },
  Medical: {
    courses: ['MLT', 'CVT', 'BPT', 'ANT', 'IMT', 'OPT', 'PAT'],
    years: ['Year 1', 'Year 2', 'Year 3', 'Year 4']
  },
  'Nursing & Pharmacy': {
    courses: ['Nursing', 'GNM', 'B.Sc Nursing', 'Pharmacy', 'D.Pharmacy', 'B.Pharmacy'],
    years: ['Year 1', 'Year 2', 'Year 3', 'Year 4']
  },
  Intermediate: {
    courses: ['Intermediate'],
    boards: { AP: ['AP Inter Board'], TS: ['TS Inter Board'] },
    groups: ['MPC', 'BiPC', 'CEC', 'HEC', 'MEC'],
    years: ['1st Year', '2nd Year']
  }
};
