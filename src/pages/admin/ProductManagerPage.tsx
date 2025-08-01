import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Tag,
  Save,
  X,
  Upload
} from 'lucide-react';
import { dbService } from '@/lib/supabase';

const ProductManagerPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pageFilter, setPageFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState('all');
  const [codeFilter, setCodeFilter] = useState('');
  const [supplierCodeFilter, setSupplierCodeFilter] = useState('');
  // Technical specification filters
  const [frequencyFilter, setFrequencyFilter] = useState('');
  const [voltageFilter, setVoltageFilter] = useState('');
  const [powerFilter, setPowerFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [weightFilter, setWeightFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 20;
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    supplier_code: '',
    price: '',
    category: '',
    subcategory: '',
    description: '',
    image_url: '',
    page_reference: '',
    supplier_cost: '',
    supplier: '',
    // Technical specifications
    hz: '',
    voltage: '',
    power: '',
    litre: '',
    kg: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(0);
      }
      
      const pageRef = pageFilter === 'all' ? undefined : pageFilter;
      const category = categoryFilter === 'all' ? undefined : categoryFilter;
      const subcategory = subcategoryFilter === 'all' ? undefined : subcategoryFilter;
      const supplier = supplierFilter === 'all' ? undefined : supplierFilter;
      const search = searchTerm.trim() || undefined;
      const code = codeFilter.trim() || undefined;
      const supplierCode = supplierCodeFilter.trim() || undefined;
      
      // Apply client-side filtering for comprehensive search
      let filteredData = await dbService.getProducts(pageRef, 0, ITEMS_PER_PAGE * 10, search, category);
      
      if (filteredData) {
        // Apply additional filters
        filteredData = filteredData.filter(product => {
          // Subcategory filter
          if (subcategory && product.subcategory !== subcategory) return false;
          
          // Supplier filter
          if (supplier && product.supplier !== supplier) return false;
          
          // Code filter
          if (code && !product.code?.toLowerCase().includes(code.toLowerCase())) return false;
          
          // Supplier code filter
          if (supplierCode && !product.supplier_code?.toLowerCase().includes(supplierCode.toLowerCase())) return false;
          
          // Technical specification filters
          if (frequencyFilter && (!product.hz || !product.hz.toString().includes(frequencyFilter))) return false;
          if (voltageFilter && (!product.voltage || !product.voltage.toString().includes(voltageFilter))) return false;
          if (powerFilter && (!product.power || !product.power.toString().includes(powerFilter))) return false;
          if (capacityFilter && (!product.litre || !product.litre.toString().includes(capacityFilter))) return false;
          if (weightFilter && (!product.kg || !product.kg.toString().includes(weightFilter))) return false;
          
          // Price range filter
          if (priceRangeFilter !== 'all') {
            const price = product.price || 0;
            switch (priceRangeFilter) {
              case 'under-100':
                if (price >= 100) return false;
                break;
              case '100-500':
                if (price < 100 || price >= 500) return false;
                break;
              case '500-1000':
                if (price < 500 || price >= 1000) return false;
                break;
              case 'over-1000':
                if (price < 1000) return false;
                break;
            }
          }
          
          return true;
        });
        
        // Paginate the filtered results
        const startIndex = 0;
        const endIndex = ITEMS_PER_PAGE;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        setProducts(paginatedData || []);
        setTotalCount(filteredData.length);
        setHasMore(filteredData.length > ITEMS_PER_PAGE);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      
      const pageRef = pageFilter === 'all' ? undefined : pageFilter;
      const category = categoryFilter === 'all' ? undefined : categoryFilter;
      const search = searchTerm.trim() || undefined;
      
      const data = await dbService.getProducts(pageRef, nextPage, ITEMS_PER_PAGE, search, category);
      
      if (data && data.length > 0) {
        setProducts(prev => [...prev, ...data]);
        setCurrentPage(nextPage);
        setHasMore(data.length >= ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        supplier_cost: parseFloat(formData.supplier_cost) || 0,
        // Technical specifications - convert to numbers if provided
        hz: formData.hz ? parseFloat(formData.hz) : undefined,
        voltage: formData.voltage ? parseFloat(formData.voltage) : undefined,
        power: formData.power ? parseFloat(formData.power) : undefined,
        litre: formData.litre ? parseFloat(formData.litre) : undefined,
        kg: formData.kg ? parseFloat(formData.kg) : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newProduct = await dbService.createProduct(productData);
      if (newProduct) {
        // Optimized: Add new product to the beginning of the list instead of full refetch
        setProducts(prev => [newProduct, ...prev]);
        setTotalCount(prev => prev + 1);
        setIsAddModalOpen(false);
        resetForm();
        
        // Update filter options if new category/page was added
        if (productData.category && !allCategories.includes(productData.category)) {
          setAllCategories(prev => [...prev, productData.category].sort());
        }
        if (productData.page_reference && !allPages.includes(productData.page_reference)) {
          setAllPages(prev => [...prev, productData.page_reference].sort());
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        supplier_cost: parseFloat(formData.supplier_cost) || 0,
        // Technical specifications - convert to numbers if provided
        hz: formData.hz ? parseFloat(formData.hz) : undefined,
        voltage: formData.voltage ? parseFloat(formData.voltage) : undefined,
        power: formData.power ? parseFloat(formData.power) : undefined,
        litre: formData.litre ? parseFloat(formData.litre) : undefined,
        kg: formData.kg ? parseFloat(formData.kg) : undefined,
        updated_at: new Date().toISOString()
      };

      const updatedProduct = await dbService.updateProduct(editingProduct.id, productData);
      if (updatedProduct) {
        // Optimized: Update product in the list instead of full refetch
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setEditingProduct(null);
        resetForm();
        
        // Update filter options if category/page changed
        if (productData.category && !allCategories.includes(productData.category)) {
          setAllCategories(prev => [...prev, productData.category].sort());
        }
        if (productData.page_reference && !allPages.includes(productData.page_reference)) {
          setAllPages(prev => [...prev, productData.page_reference].sort());
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const success = await dbService.deleteProduct(id);
        if (success) {
          // Optimized: Remove product from list instead of full refetch
          setProducts(prev => prev.filter(p => p.id !== id));
          setTotalCount(prev => prev - 1);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      supplier_code: '',
      price: '',
      category: '',
      subcategory: '',
      description: '',
      image_url: '',
      page_reference: '',
      supplier_cost: '',
      supplier: '',
      // Technical specifications
      hz: '',
      voltage: '',
      power: '',
      litre: '',
      kg: ''
    });
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      code: product.code || '',
      supplier_code: product.supplier_code || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      description: product.description || '',
      image_url: product.image_url || '',
      page_reference: product.page_reference || '',
      supplier_cost: product.supplier_cost?.toString() || '',
      supplier: product.supplier || '',
      // Technical specifications
      hz: product.hz?.toString() || '',
      voltage: product.voltage?.toString() || '',
      power: product.power?.toString() || '',
      litre: product.litre?.toString() || '',
      kg: product.kg?.toString() || ''
    });
  };

  // Optimized debounced search with longer delay for better UX
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(true);
    }, 500); // Increased debounce time for better performance
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter, pageFilter, subcategoryFilter, supplierFilter, priceRangeFilter, codeFilter, supplierCodeFilter, frequencyFilter, voltageFilter, powerFilter, capacityFilter, weightFilter]);

  // Optimized filter options fetching
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allPages, setAllPages] = useState<string[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<string[]>([]);
  const [allSuppliers, setAllSuppliers] = useState<string[]>([]);
  const [filterOptionsLoaded, setFilterOptionsLoaded] = useState(false);
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (filterOptionsLoaded) return; // Prevent multiple calls
      
      try {
        // Use optimized methods that only fetch distinct values
        const [categories, pages] = await Promise.all([
          dbService.getProductCategories(),
          dbService.getProductPageReferences()
        ]);
        
        // Get all products to extract subcategories and suppliers
        const allProducts = await dbService.getProducts(undefined, 0, 1000);
        const subcategories = [...new Set(allProducts?.map(p => p.subcategory).filter(Boolean))].sort();
        const suppliers = [...new Set(allProducts?.map(p => p.supplier).filter(Boolean))].sort();
        
        setAllCategories(categories);
        setAllPages(pages);
        setAllSubcategories(subcategories);
        setAllSuppliers(suppliers);
        setFilterOptionsLoaded(true);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, [filterOptionsLoaded]);

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => products, [products]);
  
  // Memoized search handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  
  // Memoized filter handlers
  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
  }, []);
  
  const handlePageChange = useCallback((value: string) => {
    setPageFilter(value);
  }, []);
  
  const handleSubcategoryChange = useCallback((value: string) => {
    setSubcategoryFilter(value);
  }, []);
  
  const handleSupplierChange = useCallback((value: string) => {
    setSupplierFilter(value);
  }, []);
  
  const handlePriceRangeChange = useCallback((value: string) => {
    setPriceRangeFilter(value);
  }, []);
  
  const handleCodeChange = useCallback((value: string) => {
    setCodeFilter(value);
  }, []);
  
  const handleSupplierCodeChange = useCallback((value: string) => {
    setSupplierCodeFilter(value);
  }, []);

  // Technical specification filter handlers
  const handleFrequencyChange = useCallback((value: string) => {
    setFrequencyFilter(value);
  }, []);

  const handleVoltageChange = useCallback((value: string) => {
    setVoltageFilter(value);
  }, []);

  const handlePowerChange = useCallback((value: string) => {
    setPowerFilter(value);
  }, []);

  const handleCapacityChange = useCallback((value: string) => {
    setCapacityFilter(value);
  }, []);

  const handleWeightChange = useCallback((value: string) => {
    setWeightFilter(value);
  }, []);

  const getPageBadge = (page: string) => {
    const variants: Record<string, any> = {
      'inoksan': 'bg-red-100 text-red-800',
      'refrigeration': 'bg-blue-100 text-blue-800',
      'kitchen-tools': 'bg-green-100 text-green-800',
      'hotel-equipment': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={variants[page] || 'bg-gray-100 text-gray-800'}>
        {page?.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Manager</h1>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">Product Manager</h1>
          <p className="text-sm lg:text-base text-gray-600">Manage products across all categories and pages</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="code">Product Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supplier_code">Supplier Code</Label>
                <Input
                  id="supplier_code"
                  value={formData.supplier_code}
                  onChange={(e) => setFormData({...formData, supplier_code: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="page_reference">Page Reference</Label>
                <Select value={formData.page_reference} onValueChange={(value) => setFormData({...formData, page_reference: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inoksan">Inoksan</SelectItem>
                    <SelectItem value="refrigeration">Refrigeration</SelectItem>
                    <SelectItem value="kitchen-tools">Kitchen Tools</SelectItem>
                    <SelectItem value="hotel-equipment">Hotel Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                />
              </div>
              
              {/* Technical Specifications */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Specifications (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="hz">Frequency (Hz)</Label>
                    <Input
                      id="hz"
                      type="number"
                      placeholder="50/60"
                      value={formData.hz}
                      onChange={(e) => setFormData({...formData, hz: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="voltage">Voltage (V)</Label>
                    <Input
                      id="voltage"
                      type="number"
                      placeholder="220/380"
                      value={formData.voltage}
                      onChange={(e) => setFormData({...formData, voltage: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="power">Power (W)</Label>
                    <Input
                      id="power"
                      type="number"
                      placeholder="1500"
                      value={formData.power}
                      onChange={(e) => setFormData({...formData, power: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="litre">Capacity (L)</Label>
                    <Input
                      id="litre"
                      type="number"
                      placeholder="50"
                      value={formData.litre}
                      onChange={(e) => setFormData({...formData, litre: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kg">Weight (kg)</Label>
                    <Input
                      id="kg"
                      type="number"
                      placeholder="25"
                      value={formData.kg}
                      onChange={(e) => setFormData({...formData, kg: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="min-w-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Total Products</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalCount}</p>
                <p className="text-xs text-gray-500">{products.length} loaded</p>
              </div>
              <Package className="h-6 w-6 lg:h-8 lg:w-8 text-red-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Categories</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{allCategories.length}</p>
              </div>
              <Tag className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Avg. Price</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  ${products.length > 0 ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length) : 0}
                </p>
              </div>
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Pages</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{allPages.length}</p>
              </div>
              <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search and Primary Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={pageFilter} onValueChange={handlePageChange}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  {allPages.map((page) => (
                    <SelectItem key={page} value={page}>
                      {page?.replace('-', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Additional Filters */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div>
                 <Label className="text-sm font-medium text-gray-700">Subcategory</Label>
                 <Select value={subcategoryFilter} onValueChange={handleSubcategoryChange}>
                   <SelectTrigger className="w-full">
                     <SelectValue placeholder="All Subcategories" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Subcategories</SelectItem>
                     {allSubcategories.map((subcategory) => (
                       <SelectItem key={subcategory} value={subcategory}>
                         {subcategory}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700">Supplier</Label>
                 <Select value={supplierFilter} onValueChange={handleSupplierChange}>
                   <SelectTrigger className="w-full">
                     <SelectValue placeholder="All Suppliers" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Suppliers</SelectItem>
                     {allSuppliers.map((supplier) => (
                       <SelectItem key={supplier} value={supplier}>
                         {supplier}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700">Price Range</Label>
                 <Select value={priceRangeFilter} onValueChange={handlePriceRangeChange}>
                   <SelectTrigger className="w-full">
                     <SelectValue placeholder="All Prices" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Prices</SelectItem>
                     <SelectItem value="under-100">Under €100</SelectItem>
                     <SelectItem value="100-500">€100 - €500</SelectItem>
                     <SelectItem value="500-1000">€500 - €1,000</SelectItem>
                     <SelectItem value="over-1000">Over €1,000</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700">Product Code</Label>
                 <Input
                   placeholder="Search by code..."
                   value={codeFilter}
                   onChange={(e) => handleCodeChange(e.target.value)}
                 />
               </div>
             </div>
             
             {/* Supplier Code Filter */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <Label className="text-sm font-medium text-gray-700">Supplier Code</Label>
                 <Input
                   placeholder="Search by supplier code..."
                   value={supplierCodeFilter}
                   onChange={(e) => handleSupplierCodeChange(e.target.value)}
                 />
               </div>
              
              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setPageFilter('all');
                    setSubcategoryFilter('all');
                    setSupplierFilter('all');
                    setPriceRangeFilter('all');
                    setCodeFilter('');
                    setSupplierCodeFilter('');
                    setFrequencyFilter('');
                    setVoltageFilter('');
                    setPowerFilter('');
                    setCapacityFilter('');
                    setWeightFilter('');
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Technical Specification Filters */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Technical Specifications</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Frequency (Hz)</Label>
                  <Input
                    placeholder="e.g. 50, 60..."
                    value={frequencyFilter}
                    onChange={(e) => handleFrequencyChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-gray-600">Voltage (V)</Label>
                  <Input
                    placeholder="e.g. 220, 380..."
                    value={voltageFilter}
                    onChange={(e) => handleVoltageChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-gray-600">Power (W)</Label>
                  <Input
                    placeholder="e.g. 1000, 2500..."
                    value={powerFilter}
                    onChange={(e) => handlePowerChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-gray-600">Capacity (L)</Label>
                  <Input
                    placeholder="e.g. 50, 100..."
                    value={capacityFilter}
                    onChange={(e) => handleCapacityChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-gray-600">Weight (kg)</Label>
                  <Input
                    placeholder="e.g. 25, 50..."
                    value={weightFilter}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid gap-4 lg:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow min-w-0">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-16 lg:w-20 h-16 lg:h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image_url || '/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-2 gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{product.category} • {product.subcategory}</p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {getPageBadge(product.page_reference)}
                        {product.supplier && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                            {product.supplier}
                          </Badge>
                        )}
                        <span className="text-base lg:text-lg font-bold text-green-600">
                          €{product.price?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 text-sm text-gray-600 mb-4">
                      <div className="truncate">
                        <span className="font-medium">Code:</span> {product.code}
                      </div>
                      {product.supplier_code && (
                        <div className="truncate">
                          <span className="font-medium">Supplier:</span> {product.supplier_code}
                        </div>
                      )}
                      <div className="truncate">
                        <span className="font-medium">Created:</span> {new Date(product.created_at).toLocaleDateString()}
                      </div>
                      {product.hz && (
                        <div className="truncate">
                          <span className="font-medium">Frequency:</span> {product.hz} Hz
                        </div>
                      )}
                      {product.voltage && (
                        <div className="truncate">
                          <span className="font-medium">Voltage:</span> {product.voltage} V
                        </div>
                      )}
                      {product.power && (
                        <div className="truncate">
                          <span className="font-medium">Power:</span> {product.power} W
                        </div>
                      )}
                      {product.litre && (
                        <div className="truncate">
                          <span className="font-medium">Capacity:</span> {product.litre} L
                        </div>
                      )}
                      {product.kg && (
                        <div className="truncate">
                          <span className="font-medium">Weight:</span> {product.kg} kg
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewingProduct(product)}>
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditModal(product)}>
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">No products match your current filters.</p>
            </CardContent>
          </Card>
        )}
        
        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={loadMoreProducts}
              disabled={loadingMore}
              variant="outline"
              className="px-8 py-2"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More Products'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* View Product Modal */}
      <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={viewingProduct.image_url || '/placeholder-product.svg'}
                      alt={viewingProduct.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Created:</span>
                      <p>{new Date(viewingProduct.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Updated:</span>
                      <p>{new Date(viewingProduct.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{viewingProduct.name}</h3>
                    <p className="text-lg text-green-600 font-semibold">€{viewingProduct.price?.toLocaleString() || 0}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">Code:</span>
                      <p>{viewingProduct.code}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <p>{viewingProduct.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Subcategory:</span>
                      <p>{viewingProduct.subcategory}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Page:</span>
                      <p>{viewingProduct.page_reference?.replace('-', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Supplier:</span>
                      <p>{viewingProduct.supplier || 'N/A'}</p>
                    </div>
                    {viewingProduct.supplier_code && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Supplier Code:</span>
                        <p>{viewingProduct.supplier_code}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Technical Specifications Section */}
                  {(viewingProduct.hz || viewingProduct.voltage || viewingProduct.power || viewingProduct.litre || viewingProduct.kg) && (
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">Technical Specifications:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {viewingProduct.hz && (
                          <div>
                            <span className="font-medium text-gray-600">Frequency:</span>
                            <p>{viewingProduct.hz} Hz</p>
                          </div>
                        )}
                        {viewingProduct.voltage && (
                          <div>
                            <span className="font-medium text-gray-600">Voltage:</span>
                            <p>{viewingProduct.voltage} V</p>
                          </div>
                        )}
                        {viewingProduct.power && (
                          <div>
                            <span className="font-medium text-gray-600">Power:</span>
                            <p>{viewingProduct.power} W</p>
                          </div>
                        )}
                        {viewingProduct.litre && (
                          <div>
                            <span className="font-medium text-gray-600">Capacity:</span>
                            <p>{viewingProduct.litre} L</p>
                          </div>
                        )}
                        {viewingProduct.kg && (
                          <div>
                            <span className="font-medium text-gray-600">Weight:</span>
                            <p>{viewingProduct.kg} kg</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {viewingProduct.description && (
                    <div>
                      <span className="font-medium text-gray-600">Description:</span>
                      <p className="mt-1 text-gray-900">{viewingProduct.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setViewingProduct(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setViewingProduct(null);
                  openEditModal(viewingProduct);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal - Redesigned to match the provided image */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Edit Product
              <Button variant="ghost" size="sm" onClick={() => setEditingProduct(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <p className="text-sm text-gray-600">Edit the details of an existing product.</p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Image and Image Controls */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center p-4">
                <img
                  src={formData.image_url || '/placeholder-product.svg'}
                  alt={formData.name || 'Product'}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Replace Image
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Copy URL
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
              
              <div>
                <Label htmlFor="edit-image_url">Image URL</Label>
                <Input
                  id="edit-image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Enter a URL or upload an image above"
                />
              </div>
            </div>
            
            {/* Right Column - Product Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Soiled dish soaking trolley"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="NX-TR0001"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">Type</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Industrial Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Industrial Equipment">Industrial Equipment</SelectItem>
                    <SelectItem value="Kitchen Tools">Kitchen Tools</SelectItem>
                    <SelectItem value="Refrigeration">Refrigeration</SelectItem>
                    <SelectItem value="Hotel Equipment">Hotel Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="700.75"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Product description"
                  rows={4}
                />
              </div>
              
              {/* Technical Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Specifications (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-hz">Frequency (Hz)</Label>
                    <Input
                      id="edit-hz"
                      type="number"
                      placeholder="50/60"
                      value={formData.hz}
                      onChange={(e) => setFormData({...formData, hz: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-voltage">Voltage (V)</Label>
                    <Input
                      id="edit-voltage"
                      type="number"
                      placeholder="220/380"
                      value={formData.voltage}
                      onChange={(e) => setFormData({...formData, voltage: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-power">Power (W)</Label>
                    <Input
                      id="edit-power"
                      type="number"
                      placeholder="1500"
                      value={formData.power}
                      onChange={(e) => setFormData({...formData, power: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-litre">Capacity (L)</Label>
                    <Input
                      id="edit-litre"
                      type="number"
                      placeholder="50"
                      value={formData.litre}
                      onChange={(e) => setFormData({...formData, litre: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-kg">Weight (kg)</Label>
                    <Input
                      id="edit-kg"
                      type="number"
                      placeholder="25"
                      value={formData.kg}
                      onChange={(e) => setFormData({...formData, kg: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} className="bg-blue-600 hover:bg-blue-700">
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagerPage;