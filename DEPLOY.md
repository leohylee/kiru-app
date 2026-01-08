# Deploying to AWS (S3 + CloudFront + Route 53)

## Prerequisites

- AWS CLI installed and configured (`aws configure`)
- A Route 53 hosted zone for your domain
- Node.js installed

## Quick Deploy (Existing Setup)

For subsequent deployments, just run:

```bash
npm run build
aws s3 sync dist/ s3://kiru-leohyl-app --delete
aws cloudfront create-invalidation --distribution-id E1AYXHG5C031DI --paths "/*"
```

## Full Setup (First Time)

### 1. Build the app

```bash
npm run build
```

### 2. Create S3 bucket

```bash
aws s3 mb s3://your-bucket-name
```

### 3. Configure S3 for static website hosting

```bash
# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html

# Disable public access block
aws s3api put-public-access-block \
  --bucket your-bucket-name \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}'
```

### 4. Request SSL certificate (must be in us-east-1 for CloudFront)

```bash
aws acm request-certificate \
  --domain-name your-subdomain.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

Note the `CertificateArn` from the output.

### 5. Add DNS validation record

Get the validation record:

```bash
aws acm describe-certificate \
  --certificate-arn YOUR_CERTIFICATE_ARN \
  --region us-east-1 \
  --query 'Certificate.DomainValidationOptions[0].ResourceRecord'
```

Get your hosted zone ID:

```bash
aws route53 list-hosted-zones --query "HostedZones[?Name=='yourdomain.com.'].Id" --output text
```

Add the validation CNAME record:

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "_xxxxx.your-subdomain.yourdomain.com.",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "_yyyyy.acm-validations.aws."}]
      }
    }]
  }'
```

Wait for certificate to be issued (usually 2-5 minutes):

```bash
aws acm describe-certificate \
  --certificate-arn YOUR_CERTIFICATE_ARN \
  --region us-east-1 \
  --query 'Certificate.Status'
```

### 6. Create CloudFront distribution

```bash
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "unique-string-'$(date +%s)'",
  "Aliases": {
    "Quantity": 1,
    "Items": ["your-subdomain.yourdomain.com"]
  },
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-Origin",
      "DomainName": "your-bucket-name.s3-website.YOUR-REGION.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 404,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 300
    }]
  },
  "Comment": "Distribution for your app",
  "Enabled": true,
  "ViewerCertificate": {
    "ACMCertificateArn": "YOUR_CERTIFICATE_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "PriceClass": "PriceClass_100"
}'
```

Note the `DomainName` (e.g., `d1234abcd.cloudfront.net`) and `Id` from the output.

### 7. Add Route 53 A record

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "your-subdomain.yourdomain.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d1234abcd.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

Note: `Z2FDTNDATAQYW2` is the fixed hosted zone ID for all CloudFront distributions.

### 8. Upload files

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Current Configuration

| Resource | Value |
|----------|-------|
| S3 Bucket | `kiru-leohyl-app` |
| S3 Region | `eu-west-2` |
| CloudFront ID | `E1AYXHG5C031DI` |
| Domain | `kiru.leohyl.app` |

## Troubleshooting

### "IncorrectEndpoint" error
Make sure CloudFront origin points to the correct S3 region endpoint:
- Format: `bucket-name.s3-website.REGION.amazonaws.com`

### Changes not showing
Invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Check CloudFront deployment status
```bash
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID --query 'Distribution.Status'
```
