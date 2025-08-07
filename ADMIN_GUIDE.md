# Admin Dashboard Guide

## Overview

The Admin Dashboard is a comprehensive management system for the Mitoderm Education Platform. It allows authorized administrators to upload and manage educational videos, products, and monitor user activity.

## Access

### Admin Accounts
Currently, the following email addresses have admin access:
- `admin@mitoderm.com`
- `shiri@mitoderm.com`
- `segev@futurixs.com`
- `ilona@mitoderm.co.il`

### Login Process
1. Navigate to `/auth/signin` and sign in with your Google account
2. If your email is in the admin list, you'll have access to the admin dashboard
3. Access the dashboard at `/admin`

## Dashboard Features

### 1. Dashboard Overview
- **Statistics Cards**: View total videos, active products, active users, and average ratings
- **Quick Actions**: Access to all management sections
- **Recent Activity**: Monitor platform usage

### 2. Product Management

#### Adding New Products
1. Navigate to the "Products" tab
2. Fill in the comprehensive product form:
   - **Basic Information**:
     - Product Name: Descriptive name for the product
     - Price (₪): Product price in Israeli Shekels
     - Stock Quantity: Available inventory
     - Category: Choose from existing categories
     - SKU: Unique product identifier
   - **Physical Details**:
     - Weight (g): Product weight in grams
     - Dimensions (cm): Product dimensions
   - **Product Details**:
     - Description: Detailed product description
     - Ingredients: List of ingredients
     - Instructions: Usage instructions
     - Benefits: Product benefits
     - Contraindications: Safety warnings
   - **Administrative**:
     - Expiry Date: Product expiration date
     - Manufacturer: Product manufacturer
     - Tags: Comma-separated tags for categorization
   - **Certification Requirements**:
     - Requires Certification: Whether certification is needed
     - Certification Level: Basic, Advanced, Expert, or None
   - **Marketing Features**:
     - Featured Product: Highlight on homepage
     - Best Seller: Mark as best seller
     - New Arrival: Mark as new product
   - **Product Image**: Upload high-quality product image

#### Managing Existing Products
- View all products with comprehensive information
- Edit product details (all fields are editable)
- Delete products (use with caution)
- Toggle product active/inactive status
- Monitor product performance and stock levels

#### Product Categories
Products can be categorized into:
- Serums
- Masks
- Cleansers
- Toners
- Moisturizers
- Treatments
- Accessories

### 3. Video Management

#### Uploading New Videos
1. Navigate to the "Videos" tab
2. Fill in the upload form:
   - **Video Title**: Descriptive title for the video
   - **Category**: Choose from:
     - Product Knowledge
     - Advantages & Benefits
     - Technology & Science
     - Business & Marketing
     - Before & After Cases
   - **Difficulty**: Easy, Medium, or Hard
   - **XP Reward**: Points users earn for watching (50-100 recommended)
   - **Description**: Detailed description of the video content
   - **Video File**: Upload MP4, WebM, or OGG files (max 100MB)
   - **Thumbnail Image**: Upload JPEG, PNG, or WebP images (max 10MB)

#### Managing Existing Videos
- View all uploaded videos with their status
- Edit video details (title, description, category, etc.)
- Delete videos (use with caution)
- Monitor video performance

### 4. Category Management

#### Adding New Categories
1. Navigate to the "Categories" tab
2. Fill in the category form:
   - **Category Name**: Descriptive name
   - **Icon**: Emoji or icon representation
   - **Color**: Category color for visual distinction
   - **Sort Order**: Display order (1, 2, 3, etc.)
   - **Description**: Category description
   - **Active Status**: Enable/disable category

#### Managing Categories
- View all categories with their settings
- Edit category details
- Delete categories (affects associated videos)
- Toggle category active status

### 5. Certification Management

#### Managing Certification Requests
1. Navigate to the "Certifications" tab
2. View pending certification requests
3. For each request:
   - **Review Details**: User information and request type
   - **Approve**: Grant certification with custom response
   - **Reject**: Deny certification with explanation
   - **Schedule Meeting**: For meeting requests

#### Request Types
- **Certification**: Direct certification request
- **Meeting**: Request for consultation meeting
- **Custom**: Special requests

### 6. Reward Configuration

#### Adding New Rewards
1. Navigate to the "Rewards" tab
2. Fill in the reward form:
   - **Reward Name**: Descriptive name
   - **XP Required**: Experience points needed
   - **Reward Type**: Discount, Product, Badge, or Custom
   - **Reward Value**: Specific reward (e.g., "10%", "Free Consultation")
   - **Description**: Detailed description
   - **Active Status**: Enable/disable reward

#### Reward Types
- **Discount**: Percentage or fixed amount discount
- **Product**: Free product reward
- **Badge**: Achievement badge
- **Custom**: Special rewards

## Best Practices

### Product Management
1. **Accurate Information**: Include all relevant product details
2. **High-Quality Images**: Multiple angles when possible
3. **Realistic Pricing**: Competitive but profitable
4. **Monitor Stock**: Keep inventory updated
5. **Regular Updates**: Refresh content periodically
6. **Certification Requirements**: Set appropriate certification levels
7. **Marketing Features**: Use featured, best seller, and new arrival flags strategically

### Video Content
1. **Keep it concise**: 5-15 minutes for most topics
2. **Start with an overview**: Tell viewers what they'll learn
3. **Use clear visuals**: High-quality footage and graphics
4. **Include captions**: For accessibility and clarity
5. **End with a call-to-action**: Encourage engagement

### User Engagement
1. **Monitor analytics**: Track video views and completion rates
2. **Gather feedback**: Encourage user comments and ratings
3. **Update content**: Keep information current and relevant
4. **Promote engagement**: Use gamification elements

## Security

### Admin Access
- Only authorized email addresses can access the admin dashboard
- All admin actions are logged
- Session timeout after 24 hours of inactivity
- Secure file upload validation

### Data Protection
- All user data is encrypted
- File uploads are validated for security
- Admin actions require authentication
- Regular security audits recommended

## Technical Support

### Common Issues
1. **Upload fails**: Check file size and format
2. **Video not playing**: Verify file format and encoding
3. **Image not displaying**: Check file format and size
4. **Access denied**: Verify admin email is in the list
5. **Product not saving**: Check all required fields

### Contact
For technical support or admin access requests, contact:
- Email: admin@mitoderm.com
- Phone: 054-762-1889

## Future Enhancements

### Planned Features
- **Analytics Dashboard**: Detailed user engagement metrics
- **Bulk Upload**: Upload multiple files at once
- **Content Scheduling**: Schedule content publication
- **Advanced Search**: Search through all content
- **Export Reports**: Generate usage and performance reports
- **Inventory Management**: Advanced stock tracking
- **Order Management**: Process and track orders
- **Customer Support**: Integrated support system

---

**Last Updated**: January 2024
**Version**: 1.0 