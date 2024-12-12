 module.exports = {
  openapi: '3.1.0',
  info: {
    title: 'Elysia E-Commerce API',
    version: '1.0.0',
    description: 'Comprehensive E-Commerce Backend API with Authentication and Product Management'
  },
  tags: [
    { name: 'Authentication', description: 'User registration, login, and profile management' },
    { name: 'Products', description: 'Product catalog and management' },
    { name: 'Cart', description: 'Shopping cart operations' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: { type: 'string' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the product' },
          oemNo: { 
            type: 'string',
            description: 'Original Equipment Manufacturer number',
            example: 'OEM-123456'
          },
          codeOfProduct: { 
            type: 'string',
            description: 'Internal product code',
            example: 'PROD-123'
          },
          name: { 
            type: 'string',
            description: 'Product name',
            example: 'Brake Pads'
          },
          price: { 
            type: 'number',
            description: 'Product price',
            example: 49.99,
            minimum: 0
          },
          priceWithKDV: { 
            type: 'number',
            description: 'Price including tax',
            example: 58.99,
            minimum: 0,
            default: null
          },
          discount: { 
            type: 'number',
            description: 'Discount percentage',
            example: 10,
            minimum: 0,
            maximum: 100,
            default: 0
          },
          manufacturer: { 
            type: 'string',
            description: 'Product manufacturer',
            example: 'BrakeMaster',
            default: ''
          },
          stock: { 
            type: 'boolean',
            description: 'Product availability',
            default: true
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Product image file'
          },
          createdAt: { type: 'string', format: 'date-time', description: 'Product creation timestamp' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Product last update timestamp' },
        },
      },
      ProductCreateRequest: {
        type: 'object',
        required: ['oemNo', 'codeOfProduct', 'name', 'price'],
        properties: {
          oemNo: { 
            type: 'string',
            description: 'Original Equipment Manufacturer number',
            example: 'OEM-123456'
          },
          codeOfProduct: { 
            type: 'string',
            description: 'Internal product code',
            example: 'PROD-123'
          },
          name: { 
            type: 'string',
            description: 'Product name',
            example: 'Brake Pads'
          },
          price: { 
            type: 'number',
            description: 'Product price',
            example: 49.99,
            minimum: 0
          },
          priceWithKDV: { 
            type: 'number',
            description: 'Price including tax',
            example: 58.99,
            minimum: 0,
            default: null
          },
          discount: { 
            type: 'number',
            description: 'Discount percentage',
            example: 10,
            minimum: 0,
            maximum: 100,
            default: 0
          },
          manufacturer: { 
            type: 'string',
            description: 'Product manufacturer',
            example: 'BrakeMaster',
            default: ''
          },
          stock: { 
            type: 'boolean',
            description: 'Product availability',
            default: true
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Product image file'
          }
        },
      },
      ProductUpdateRequest: {
        type: 'object',
        properties: {
          oemNo: { 
            type: 'string',
            description: 'Original Equipment Manufacturer number',
            example: 'OEM-123456'
          },
          codeOfProduct: { 
            type: 'string',
            description: 'Internal product code',
            example: 'PROD-123'
          },
          name: { 
            type: 'string',
            description: 'Product name',
            example: 'Brake Pads'
          },
          price: { 
            type: 'number',
            description: 'Product price',
            example: 49.99,
            minimum: 0
          },
          priceWithKDV: { 
            type: 'number',
            description: 'Price including tax',
            example: 58.99,
            minimum: 0,
            default: null
          },
          discount: { 
            type: 'number',
            description: 'Discount percentage',
            example: 10,
            minimum: 0,
            maximum: 100,
            default: 0
          },
          manufacturer: { 
            type: 'string',
            description: 'Product manufacturer',
            example: 'BrakeMaster',
            default: ''
          },
          stock: { 
            type: 'boolean',
            description: 'Product availability',
            default: true
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Product image file'
          }
        },
      },
      ProductListResponse: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', description: 'Current page number' },
              limit: { type: 'number', description: 'Number of items per page' },
              total: { type: 'number', description: 'Total number of products' },
              totalPages: { type: 'number', description: 'Total number of pages' },
            },
          },
        },
      },
      ProductImageUpload: {
        type: 'object',
        description: 'Product creation request with image upload',
        required: ['name', 'OemNo', 'codeOfProduct', 'price', 'priceWithKDV', 'manufacturer', 'stock', 'image'],
        properties: {
          name: { 
            type: 'string',
            description: 'Product name',
            example: 'Brake Pads'
          },
          OemNo: { 
            type: 'string',
            description: 'Original Equipment Manufacturer number',
            example: 'OEM-123456'
          },
          codeOfProduct: { 
            type: 'string',
            description: 'Internal product code',
            example: 'PROD-123'
          },
          price: { 
            type: 'number',
            description: 'Product price',
            example: 49.99
          },
          priceWithKDV: { 
            type: 'number',
            description: 'Price including tax',
            example: 58.99
          },
          manufacturer: { 
            type: 'string',
            description: 'Product manufacturer',
            example: 'BrakeMaster'
          },
          stock: { 
            type: 'boolean',
            description: 'Product availability',
            example: true
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Product image file to upload'
          }
        }
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          productId: { type: 'string' },
          quantity: { type: 'number' }
        }
      },
      CartResponse: {
        type: 'object',
        properties: {
          cartItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' }
          }
        }
      },
      CartTotalResponse: {
        type: 'object',
        properties: {
          total: { type: 'number', format: 'float' }
        }
      },
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' }
                },
                required: ['email', 'password', 'name']
              },
              example: {
                email: 'david@davidhmtl.xyz',
                password: 'securePassword123',
                name: 'David Html'
              }
            }
          }
        },
        responses: {
          '201': { description: 'User successfully registered' },
          '400': { description: 'Registration failed' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              },
              example: {
                email: 'david@davidhmtl.xyz',
                password: 'securePassword123'
              }
            }
          }
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' }
        }
      }
    },
    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get user\'s cart items',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { 
            description: 'Successfully retrieved cart items',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CartResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Cart'],
        summary: 'Add item to cart',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'number', minimum: 1 }
                },
                required: ['productId', 'quantity']
              },
              example: {
                productId: 'prod_123',
                quantity: 2
              }
            }
          }
        },
        responses: {
          '201': { description: 'Cart item added successfully' },
          '400': { description: 'Failed to add cart item' }
        }
      }
    },
    '/api/cart/{id}': {
      put: {
        tags: ['Cart'],
        summary: 'Update cart item quantity',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  quantity: { type: 'number', minimum: 1 }
                },
                required: ['quantity']
              },
              example: {
                quantity: 3
              }
            }
          }
        },
        responses: {
          '200': { description: 'Cart item updated successfully' },
          '404': { description: 'Failed to update cart item' }
        }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove item from cart',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Cart item deleted successfully' },
          '404': { description: 'Failed to delete cart item' }
        }
      }
    },
    '/api/cart/total': {
      get: {
        tags: ['Cart'],
        summary: 'Calculate total cart value',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { 
            description: 'Cart total calculated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CartTotalResponse' }
              }
            }
          }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        description: 'Retrieve a list of products with optional filtering and pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: { type: 'number', default: 1, minimum: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            schema: { type: 'number', default: 10, minimum: 1, maximum: 100 }
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search term to filter products by name, OEM number, code, or manufacturer',
            schema: { type: 'string' }
          },
          {
            name: 'minPrice',
            in: 'query',
            description: 'Minimum price filter',
            schema: { type: 'number' }
          },
          {
            name: 'maxPrice',
            in: 'query',
            description: 'Maximum price filter',
            schema: { type: 'number' }
          },
          {
            name: 'inStock',
            in: 'query',
            description: 'Filter by stock availability',
            schema: { type: 'boolean' }
          }
        ],
        responses: {
          '200': {
            description: 'List of products with pagination details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product with image',
        description: 'Create a new product by uploading an image file',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { 
                    type: 'string',
                    description: 'Product name',
                    example: 'Brake Pads'
                  },
                  OemNo: { 
                    type: 'string',
                    description: 'Original Equipment Manufacturer number',
                    example: 'OEM-123456'
                  },
                  codeOfProduct: { 
                    type: 'string',
                    description: 'Internal product code',
                    example: 'PROD-123'
                  },
                  price: { 
                    type: 'number',
                    description: 'Product price',
                    example: 49.99
                  },
                  priceWithKDV: { 
                    type: 'number',
                    description: 'Price including tax',
                    example: 58.99
                  },
                  manufacturer: { 
                    type: 'string',
                    description: 'Product manufacturer',
                    example: 'BrakeMaster'
                  },
                  stock: { 
                    type: 'boolean',
                    description: 'Product availability',
                    example: true
                  },
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Product image file to upload'
                  }
                },
                required: ['name', 'OemNo', 'codeOfProduct', 'price', 'priceWithKDV', 'manufacturer', 'stock', 'image']
              },
              examples: {
                'Product with Image': {
                  summary: 'Example of creating a product with an image file',
                  value: {
                    name: 'Brake Pads',
                    OemNo: 'OEM-123456',
                    codeOfProduct: 'PROD-123',
                    price: 49.99,
                    priceWithKDV: 58.99,
                    manufacturer: 'BrakeMaster',
                    stock: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    product: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        description: 'Retrieve a specific product by its unique identifier',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product ID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Product details retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Update a product',
        description: 'Update an existing product with the provided details and optional image upload',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product ID',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  oemNo: { 
                    type: 'string',
                    description: 'Original Equipment Manufacturer number',
                    example: 'OEM-123456'
                  },
                  codeOfProduct: { 
                    type: 'string',
                    description: 'Internal product code',
                    example: 'PROD-123'
                  },
                  name: { 
                    type: 'string',
                    description: 'Product name',
                    example: 'Brake Pads'
                  },
                  price: { 
                    type: 'number',
                    description: 'Product price',
                    example: 49.99,
                    minimum: 0
                  },
                  priceWithKDV: { 
                    type: 'number',
                    description: 'Price including tax',
                    example: 58.99,
                    minimum: 0,
                    default: null
                  },
                  discount: { 
                    type: 'number',
                    description: 'Discount percentage',
                    example: 10,
                    minimum: 0,
                    maximum: 100,
                    default: 0
                  },
                  manufacturer: { 
                    type: 'string',
                    description: 'Product manufacturer',
                    example: 'BrakeMaster',
                    default: ''
                  },
                  stock: { 
                    type: 'boolean',
                    description: 'Product availability',
                    default: true
                  },
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Product image file'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product',
        description: 'Delete an existing product by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product ID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
  },
};