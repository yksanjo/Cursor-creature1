#!/bin/bash

# Script to help explore JavaScript animation repositories on GitHub
# Usage: ./explore-repos.sh [library-name]

echo "🎨 JavaScript Animation Libraries Explorer"
echo "=========================================="
echo ""

# Define repositories
declare -A repos=(
    ["three"]="https://github.com/mrdoob/three.js.git"
    ["gsap"]="https://github.com/greensock/GSAP.git"
    ["anime"]="https://github.com/juliangarnier/anime.git"
    ["pixi"]="https://github.com/pixijs/pixijs.git"
    ["matter"]="https://github.com/liabru/matter-js.git"
    ["p5"]="https://github.com/processing/p5.js.git"
    ["d3"]="https://github.com/d3/d3.git"
    ["mojs"]="https://github.com/mojs/mojs.git"
    ["lottie"]="https://github.com/airbnb/lottie-web.git"
    ["velocity"]="https://github.com/julianshapiro/velocity.git"
    ["shaders"]="https://github.com/patriciogonzalezvivo/thebookofshaders.git"
)

# Create research directory
RESEARCH_DIR="./research"
mkdir -p "$RESEARCH_DIR"

# Function to clone and setup a repo
clone_repo() {
    local name=$1
    local url=$2
    local dir="$RESEARCH_DIR/$name"
    
    if [ -d "$dir" ]; then
        echo "📁 $name already exists. Updating..."
        cd "$dir" && git pull && cd - > /dev/null
    else
        echo "📥 Cloning $name..."
        git clone "$url" "$dir" --depth 1
    fi
    
    echo "✅ $name ready in $dir"
    echo ""
}

# Function to show repo info
show_info() {
    local name=$1
    local dir="$RESEARCH_DIR/$name"
    
    if [ -d "$dir" ]; then
        echo "📊 $name Repository Info:"
        echo "   Location: $dir"
        echo "   Size: $(du -sh "$dir" 2>/dev/null | cut -f1)"
        echo ""
        
        # Show key files
        echo "🔍 Key Files to Explore:"
        case $name in
            "three")
                echo "   - examples/js/shaders/"
                echo "   - examples/js/objects/ParticleSystem.js"
                echo "   - src/materials/ShaderMaterial.js"
                ;;
            "gsap")
                echo "   - src/Tween.js"
                echo "   - src/Timeline.js"
                echo "   - src/easing/"
                ;;
            "anime")
                echo "   - src/anime.js"
                echo "   - src/core/"
                echo "   - src/easings/"
                ;;
            "shaders")
                echo "   - glsl/"
                echo "   - examples/"
                ;;
        esac
        echo ""
    fi
}

# Function to open in browser
open_github() {
    local name=$1
    local url=${repos[$name]}
    echo "🌐 Opening GitHub page for $name..."
    open "${url%.git}" 2>/dev/null || xdg-open "${url%.git}" 2>/dev/null || echo "   Please visit: ${url%.git}"
}

# Main menu
if [ -z "$1" ]; then
    echo "Available libraries:"
    echo ""
    for name in "${!repos[@]}"; do
        echo "  - $name"
    done
    echo ""
    echo "Usage:"
    echo "  ./explore-repos.sh [library-name]     # Clone and explore"
    echo "  ./explore-repos.sh [library-name] info # Show info"
    echo "  ./explore-repos.sh [library-name] web  # Open GitHub page"
    echo "  ./explore-repos.sh all                 # Clone all"
    echo ""
    exit 0
fi

# Handle commands
if [ "$1" == "all" ]; then
    echo "📦 Cloning all repositories..."
    echo ""
    for name in "${!repos[@]}"; do
        clone_repo "$name" "${repos[$name]}"
    done
    echo "✅ All repositories cloned to $RESEARCH_DIR/"
elif [ "$2" == "info" ]; then
    show_info "$1"
elif [ "$2" == "web" ]; then
    open_github "$1"
elif [ -n "${repos[$1]}" ]; then
    clone_repo "$1" "${repos[$1]}"
    show_info "$1"
    echo "💡 Next steps:"
    echo "   cd $RESEARCH_DIR/$1"
    echo "   # Explore the codebase"
    echo "   # Check examples/ directory if available"
    echo "   # Read README.md for documentation"
else
    echo "❌ Unknown library: $1"
    echo "Available: ${!repos[@]}"
    exit 1
fi

