/**
 * MealSection.jsx - Nutrition & Meal Recommendations
 * 
 * Features:
 * - Recipe suggestions from Edamam/Spoonacular API
 * - Nutrition information display
 * - Dietary restriction filtering
 * - Meal planning and favorites
 * - Calorie and macro tracking
 */

import React, { useState, useEffect } from 'react';
import { Heart, Clock, Users, Zap, Search, BookOpen } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const MealSection = ({ dietaryRestrictions = [] }) => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('healthy');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // Meal types for filtering
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', emoji: '🥞' },
    { id: 'lunch', label: 'Lunch', emoji: '🥗' },
    { id: 'dinner', label: 'Dinner', emoji: '🍽️' },
    { id: 'snack', label: 'Snacks', emoji: '🥜' }
  ];

  // Mock recipe data (replace with real API in production)
  const mockRecipes = {
    breakfast: [
      {
        id: 1,
        label: 'Avocado Toast with Eggs',
        image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Healthy Meals',
        url: '#',
        yield: 2,
        dietLabels: ['High-Fiber', 'Vegetarian'],
        healthLabels: ['Vegetarian', 'Gluten-Free-Option'],
        calories: 320,
        totalTime: 15,
        cuisineType: ['American'],
        mealType: ['breakfast'],
        totalNutrients: {
          ENERC_KCAL: { quantity: 320, unit: 'kcal' },
          PROCNT: { quantity: 18, unit: 'g' },
          CHOCDF: { quantity: 25, unit: 'g' },
          FAT: { quantity: 20, unit: 'g' }
        },
        ingredients: [
          { text: '2 slices whole grain bread' },
          { text: '1 ripe avocado' },
          { text: '2 eggs' },
          { text: 'Salt and pepper to taste' },
          { text: 'Optional: red pepper flakes' }
        ]
      },
      {
        id: 2,
        label: 'Greek Yogurt Berry Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Nutrition Plus',
        url: '#',
        yield: 1,
        dietLabels: ['High-Protein', 'Low-Fat'],
        healthLabels: ['Vegetarian', 'Gluten-Free'],
        calories: 280,
        totalTime: 5,
        cuisineType: ['Mediterranean'],
        mealType: ['breakfast'],
        totalNutrients: {
          ENERC_KCAL: { quantity: 280, unit: 'kcal' },
          PROCNT: { quantity: 20, unit: 'g' },
          CHOCDF: { quantity: 35, unit: 'g' },
          FAT: { quantity: 8, unit: 'g' }
        },
        ingredients: [
          { text: '1 cup Greek yogurt' },
          { text: '1/2 cup mixed berries' },
          { text: '2 tbsp granola' },
          { text: '1 tbsp honey' },
          { text: '1 tbsp chia seeds' }
        ]
      }
    ],
    lunch: [
      {
        id: 3,
        label: 'Quinoa Buddha Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Plant Based',
        url: '#',
        yield: 2,
        dietLabels: ['High-Fiber', 'Vegan'],
        healthLabels: ['Vegan', 'Gluten-Free'],
        calories: 420,
        totalTime: 30,
        cuisineType: ['Mediterranean'],
        mealType: ['lunch'],
        totalNutrients: {
          ENERC_KCAL: { quantity: 420, unit: 'kcal' },
          PROCNT: { quantity: 15, unit: 'g' },
          CHOCDF: { quantity: 65, unit: 'g' },
          FAT: { quantity: 12, unit: 'g' }
        },
        ingredients: [
          { text: '1 cup cooked quinoa' },
          { text: '1 cup roasted vegetables' },
          { text: '1/2 avocado' },
          { text: '2 tbsp hummus' },
          { text: 'Mixed greens' },
          { text: 'Lemon tahini dressing' }
        ]
      }
    ],
    dinner: [
      {
        id: 4,
        label: 'Grilled Salmon with Vegetables',
        image: 'https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Healthy Kitchen',
        url: '#',
        yield: 2,
        dietLabels: ['High-Protein', 'Low-Carb'],
        healthLabels: ['Pescatarian', 'Gluten-Free', 'Dairy-Free'],
        calories: 380,
        totalTime: 25,
        cuisineType: ['Mediterranean'],
        mealType: ['dinner'],
        totalNutrients: {
          ENERC_KCAL: { quantity: 380, unit: 'kcal' },
          PROCNT: { quantity: 35, unit: 'g' },
          CHOCDF: { quantity: 15, unit: 'g' },
          FAT: { quantity: 22, unit: 'g' }
        },
        ingredients: [
          { text: '6 oz salmon fillet' },
          { text: '2 cups mixed vegetables' },
          { text: '1 tbsp olive oil' },
          { text: 'Herbs and spices' },
          { text: 'Lemon for serving' }
        ]
      }
    ],
    snack: [
      {
        id: 5,
        label: 'Energy Balls',
        image: 'https://images.pexels.com/photos/1435740/pexels-photo-1435740.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Snack Time',
        url: '#',
        yield: 12,
        dietLabels: ['High-Fiber', 'Vegan'],
        healthLabels: ['Vegan', 'Gluten-Free'],
        calories: 95,
        totalTime: 15,
        cuisineType: ['American'],
        mealType: ['snack'],
        totalNutrients: {
          ENERC_KCAL: { quantity: 95, unit: 'kcal' },
          PROCNT: { quantity: 3, unit: 'g' },
          CHOCDF: { quantity: 12, unit: 'g' },
          FAT: { quantity: 5, unit: 'g' }
        },
        ingredients: [
          { text: '1 cup dates, pitted' },
          { text: '1/2 cup almonds' },
          { text: '2 tbsp chia seeds' },
          { text: '1 tbsp cocoa powder' },
          { text: '1 tsp vanilla extract' }
        ]
      }
    ]
  };

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wellnessHub_favoriteRecipes');
    if (saved) {
      setFavoriteRecipes(JSON.parse(saved));
    }
  }, []);

  // Fetch recipes based on meal type
  const fetchRecipes = async (mealType = selectedMealType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In production, use real API (Edamam or Spoonacular):
      // const response = await fetch(
      //   `https://api.edamam.com/search?q=${searchTerm}&app_id=${APP_ID}&app_key=${APP_KEY}&mealType=${mealType}`
      // );
      
      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const recipeData = mockRecipes[mealType] || [];
      
      setRecipes(recipeData);
      setCurrentRecipe(recipeData[0] || null);
    } catch (err) {
      setError('Unable to load recipes. Please try again.');
      console.error('Recipe fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(selectedMealType);
  }, [selectedMealType]);

  // Toggle favorite recipe
  const toggleFavorite = (recipe) => {
    const isAlreadyFavorite = favoriteRecipes.some(fav => fav.id === recipe.id);
    let updatedFavorites;
    
    if (isAlreadyFavorite) {
      updatedFavorites = favoriteRecipes.filter(fav => fav.id !== recipe.id);
    } else {
      updatedFavorites = [...favoriteRecipes, recipe];
    }
    
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('wellnessHub_favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  // Add recipe to daily nutrition
  const addToNutrition = (recipe) => {
    setDailyNutrition(prev => ({
      calories: prev.calories + Math.round(recipe.calories / recipe.yield),
      protein: prev.protein + Math.round(recipe.totalNutrients.PROCNT.quantity / recipe.yield),
      carbs: prev.carbs + Math.round(recipe.totalNutrients.CHOCDF.quantity / recipe.yield),
      fat: prev.fat + Math.round(recipe.totalNutrients.FAT.quantity / recipe.yield)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nutrition & Meals</h2>
        <p className="text-gray-600">Discover healthy recipes and track your nutrition</p>
      </div>

      {/* Daily Nutrition Tracker */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Nutrition</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{dailyNutrition.calories}</div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{dailyNutrition.protein}g</div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{dailyNutrition.carbs}g</div>
            <div className="text-sm text-gray-600">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{dailyNutrition.fat}g</div>
            <div className="text-sm text-gray-600">Fat</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for recipes..."
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => fetchRecipes(selectedMealType)}
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Meal Type Selection */}
        <div className="flex flex-wrap gap-2">
          {mealTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedMealType(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedMealType === type.id
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/20 text-gray-700 hover:bg-white/30'
              }`}
            >
              <span>{type.emoji}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading delicious recipes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">🍽️❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchRecipes(selectedMealType)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : currentRecipe ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recipe Image */}
            <div>
              <img
                src={currentRecipe.image}
                alt={currentRecipe.label}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
              
              {/* Recipe Meta */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">{currentRecipe.totalTime} min</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">{currentRecipe.yield} servings</div>
                </div>
                <div className="text-center">
                  <Zap className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">{Math.round(currentRecipe.calories / currentRecipe.yield)} cal</div>
                </div>
              </div>
            </div>

            {/* Recipe Details */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentRecipe.label}
              </h3>
              
              {/* Diet and Health Labels */}
              <div className="flex flex-wrap gap-2 mb-4">
                {currentRecipe.dietLabels.map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-500/20 text-green-700 text-xs rounded-full"
                  >
                    {label}
                  </span>
                ))}
                {currentRecipe.healthLabels.slice(0, 3).map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-700 text-xs rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Nutrition Info */}
              <div className="bg-white/20 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Nutrition per serving</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-lg font-bold text-orange-500">
                      {Math.round(currentRecipe.calories / currentRecipe.yield)}
                    </div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-500">
                      {Math.round(currentRecipe.totalNutrients.PROCNT.quantity / currentRecipe.yield)}g
                    </div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-500">
                      {Math.round(currentRecipe.totalNutrients.CHOCDF.quantity / currentRecipe.yield)}g
                    </div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {Math.round(currentRecipe.totalNutrients.FAT.quantity / currentRecipe.yield)}g
                    </div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Ingredients</h4>
                <ul className="space-y-1">
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {ingredient.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleFavorite(currentRecipe)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                    favoriteRecipes.some(fav => fav.id === currentRecipe.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/20 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>
                    {favoriteRecipes.some(fav => fav.id === currentRecipe.id) ? 'Favorited' : 'Favorite'}
                  </span>
                </button>
                
                <button
                  onClick={() => addToNutrition(currentRecipe)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Add to Today</span>
                </button>
                
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Full Recipe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recipe List */}
      {recipes.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            More {mealTypes.find(t => t.id === selectedMealType)?.label} Ideas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.filter(recipe => recipe.id !== currentRecipe?.id).map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setCurrentRecipe(recipe)}
                className="text-left bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors border border-white/20"
              >
                <img
                  src={recipe.image}
                  alt={recipe.label}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                  {recipe.label}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{Math.round(recipe.calories / recipe.yield)} cal</span>
                  <span>{recipe.totalTime} min</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSection;