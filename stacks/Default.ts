import { StackContext, NextjsSite } from 'sst/constructs'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'

export type Stage = 'dev' | 'prod'

const CUSTOM_DOMAINS: Record<Stage, string> = {
  dev: 'esusu-dev.sbaidon.dev',
  prod: 'esusu.sbaidon.dev'
}

// Taken directly from AWS
const CERTIFICATE_ARNS: Record<Stage, string> = {
  dev: 'arn:aws:acm:us-east-1:431452277450:certificate/edb8cdda-0d4e-4795-8993-68562df11ead',
  prod: 'arn:aws:acm:us-east-1:431452277450:certificate/1eac2fe1-c569-45ea-b762-23996abf510e'
}

export function Default({ stack }: StackContext) {
  const site = new NextjsSite(stack, 'site', {
    path: 'packages/web',
    memorySize: '2048 MB',
    customDomain: {
      domainName: CUSTOM_DOMAINS[stack.stage],
      isExternalDomain: true,
      cdk: {
        certificate: Certificate.fromCertificateArn(stack, `${stack.stage}-Certificate`, CERTIFICATE_ARNS[stack.stage])
      }
    },
    edge: true
  })

  stack.addOutputs({
    SiteUrl: site.url
  })
}
