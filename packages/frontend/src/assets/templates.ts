import {
  VITE_GITHUB_IMAGE_UPLOAD_PWA_TEMPLATE_REPO,
  VITE_GITHUB_PWA_TEMPLATE_REPO,
} from 'utils/constants';

export default [
  {
    id: '1',
    name: 'Progressive Web App (PWA)',
    icon: 'pwa',
    repoFullName: `${VITE_GITHUB_PWA_TEMPLATE_REPO}`,
    isComingSoon: false,
  },
  {
    id: '2',
    name: 'Image Upload PWA',
    icon: 'pwa',
    repoFullName: `${VITE_GITHUB_IMAGE_UPLOAD_PWA_TEMPLATE_REPO}`,
    isComingSoon: false,
  },
  {
    id: '3',
    name: 'Kotlin',
    icon: 'kotlin',
    repoFullName: '',
    isComingSoon: true,
  },
  {
    id: '4',
    name: 'React Native',
    icon: 'react-native',
    repoFullName: '',
    isComingSoon: true,
  },
  {
    id: '5',
    name: 'Swift',
    icon: 'swift',
    repoFullName: '',
    isComingSoon: true,
  },
];
