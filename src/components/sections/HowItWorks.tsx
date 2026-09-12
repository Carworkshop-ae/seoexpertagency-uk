import { ProcessSteps } from './ProcessSteps'

interface Step {
  title: string
  description: string
  icon?: string
}

interface HowItWorksProps {
  heading?: string
  steps?: Step[]
}

export function HowItWorks({ heading, steps }: HowItWorksProps) {
  return (
    <ProcessSteps
      title={heading || 'Our Proven SEO Framework'}
      {...(steps
        ? {
            steps: steps.map((s, idx) => ({
              number: idx + 1,
              title: s.title,
              description: s.description,
            })),
          }
        : {})}
    />
  )
}
