import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  output: 'static',
  outDir: './docs-dist',
  integrations: [
    starlight({
      title: 'branchbrief',
      description: 'Local-first branch review briefs for humans and AI reviewers.',
      logo: {
        src: './src/assets/branchbrief-icon.svg',
        alt: 'branchbrief',
      },
      favicon: '/favicon.svg',
      social: {
        github: 'https://github.com/rogerchappel/branchbrief',
      },
      components: {
        Footer: './src/components/Footer.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'What is branchbrief?', link: '/getting-started/' },
            { label: 'Installation', link: '/getting-started/installation/' },
            { label: 'Quickstart', link: '/getting-started/quickstart/' },
            { label: 'Local CLI usage', link: '/getting-started/local-cli-usage/' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { label: 'Branch briefs', link: '/core-concepts/branch-briefs/' },
            { label: 'Risk levels', link: '/core-concepts/risk-levels/' },
            { label: 'Verification suggestions', link: '/core-concepts/verification-suggestions/' },
            { label: 'Local-first by default', link: '/core-concepts/local-first/' },
            { label: 'LLM-enhanced by choice', link: '/core-concepts/llm-enhanced/' },
          ],
        },
        {
          label: 'CLI Reference',
          items: [{ label: 'branchbrief', link: '/reference/cli/' }],
        },
        {
          label: 'GitHub Actions',
          items: [
            { label: 'Job summary workflow', link: '/github-actions/job-summary-workflow/' },
            { label: 'Artifact upload', link: '/github-actions/artifact-upload/' },
            { label: 'Risk gate', link: '/github-actions/risk-gate/' },
            { label: 'PR comment mode', link: '/github-actions/pr-comment-mode/' },
          ],
        },
        {
          label: 'Copilot',
          items: [{ label: 'Copilot context', link: '/copilot/' }],
        },
        {
          label: 'LLM Policy',
          items: [{ label: 'Policy', link: '/policy/llm-policy/' }],
        },
        {
          label: 'Contributors',
          items: [
            { label: 'Roadmap', link: '/contributors/roadmap/' },
            { label: 'Agent work plan', link: '/contributors/agent-work-plan/' },
            { label: 'Architecture', link: '/contributors/architecture/' },
            { label: 'Testing', link: '/contributors/testing/' },
            { label: 'Release checklist', link: '/contributors/release-checklist/' },
          ],
        },
        {
          label: 'Examples',
          items: [{ label: 'Examples', link: '/examples/' }],
        },
      ],
    }),
  ],
});
