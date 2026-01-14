#!/bin/bash

# 🧪 Script de Test Automatique - Calculateur 3D v3.0.1
# Ce script vérifie que le conteneur Docker fonctionne correctement

echo "🧪 Tests Automatiques du Calculateur 3D"
echo "========================================"
echo ""

# Variables
CONTAINER_NAME="calculateur-impression-3d"
PORT="3080"
HOST="localhost"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction pour afficher un test
test_start() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Test $TOTAL_TESTS: $1 ... "
}

# Fonction pour test réussi
test_pass() {
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✓ PASS${NC}"
    if [ ! -z "$1" ]; then
        echo "  → $1"
    fi
}

# Fonction pour test échoué
test_fail() {
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${RED}✗ FAIL${NC}"
    if [ ! -z "$1" ]; then
        echo "  → $1"
    fi
}

# Fonction pour test warning
test_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}"
    if [ ! -z "$1" ]; then
        echo "  → $1"
    fi
}

echo "🔍 Vérification de l'environnement"
echo "-----------------------------------"

# Test 1: Docker installé
test_start "Docker est installé"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    test_pass "Docker $DOCKER_VERSION"
else
    test_fail "Docker n'est pas installé"
    exit 1
fi

# Test 2: Docker en cours d'exécution
test_start "Docker daemon est en cours d'exécution"
if docker info &> /dev/null; then
    test_pass
else
    test_fail "Le daemon Docker ne répond pas"
    exit 1
fi

echo ""
echo "🐳 Vérification du conteneur"
echo "----------------------------"

# Test 3: Conteneur existe
test_start "Le conteneur '$CONTAINER_NAME' existe"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    test_pass
else
    test_fail "Conteneur non trouvé. Avez-vous déployé la stack dans Portainer ?"
    exit 1
fi

# Test 4: Conteneur est en cours d'exécution
test_start "Le conteneur est en cours d'exécution"
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    test_pass
else
    test_fail "Le conteneur existe mais n'est pas démarré"
    echo ""
    echo "Pour démarrer le conteneur :"
    echo "  docker start $CONTAINER_NAME"
    exit 1
fi

# Test 5: Version du conteneur
test_start "Version du conteneur"
VERSION=$(docker inspect --format '{{index .Config.Labels "com.example.version"}}' $CONTAINER_NAME 2>/dev/null)
if [ ! -z "$VERSION" ]; then
    if [ "$VERSION" == "3.0.1" ]; then
        test_pass "v$VERSION (correct)"
    else
        test_warn "v$VERSION (attendu: v3.0.1)"
        echo "  → Redéployez la stack pour obtenir la dernière version"
    fi
else
    test_warn "Version non trouvée dans les labels"
fi

# Test 6: Health check
test_start "Health check du conteneur"
HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null)
if [ "$HEALTH" == "healthy" ]; then
    test_pass "Conteneur en bonne santé"
elif [ "$HEALTH" == "starting" ]; then
    test_warn "Conteneur en cours de démarrage"
else
    test_warn "Health status: $HEALTH"
fi

echo ""
echo "🌐 Vérification du réseau"
echo "------------------------"

# Test 7: Port mappé
test_start "Port $PORT est mappé"
PORT_MAPPING=$(docker port $CONTAINER_NAME 2>/dev/null | grep -c "0.0.0.0:$PORT")
if [ $PORT_MAPPING -gt 0 ]; then
    test_pass "Port $PORT → 80"
else
    test_fail "Port $PORT n'est pas mappé"
fi

# Test 8: Port accessible
test_start "Port $PORT est accessible"
if command -v nc &> /dev/null; then
    if nc -z $HOST $PORT 2>/dev/null; then
        test_pass "Port ouvert"
    else
        test_fail "Impossible de se connecter au port $PORT"
    fi
else
    test_warn "Outil 'nc' non disponible, test ignoré"
fi

# Test 9: Serveur web répond
test_start "Le serveur web répond"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST:$PORT/ 2>/dev/null)
    if [ "$HTTP_CODE" == "200" ]; then
        test_pass "HTTP 200 OK"
    else
        test_fail "HTTP $HTTP_CODE"
    fi
else
    test_warn "Outil 'curl' non disponible, test ignoré"
fi

echo ""
echo "📄 Vérification des fichiers"
echo "----------------------------"

# Test 10: index.html existe
test_start "Fichier index.html existe"
if docker exec $CONTAINER_NAME test -f /usr/share/nginx/html/index.html 2>/dev/null; then
    SIZE=$(docker exec $CONTAINER_NAME stat -c%s /usr/share/nginx/html/index.html 2>/dev/null)
    test_pass "Taille: $((SIZE / 1024)) KB"
else
    test_fail "index.html non trouvé dans le conteneur"
fi

# Test 11: calculator.js existe
test_start "Fichier calculator.js existe"
if docker exec $CONTAINER_NAME test -f /usr/share/nginx/html/js/calculator.js 2>/dev/null; then
    SIZE=$(docker exec $CONTAINER_NAME stat -c%s /usr/share/nginx/html/js/calculator.js 2>/dev/null)
    test_pass "Taille: $((SIZE / 1024)) KB"
else
    test_fail "calculator.js non trouvé"
fi

# Test 12: test-auto.html existe
test_start "Fichier test-auto.html existe (nouveau)"
if docker exec $CONTAINER_NAME test -f /usr/share/nginx/html/test-auto.html 2>/dev/null; then
    test_pass "Fichier de tests automatiques disponible"
else
    test_warn "test-auto.html non trouvé (ancienne version ?)"
fi

echo ""
echo "📊 Vérification du contenu"
echo "-------------------------"

# Test 13: Script inline présent dans index.html
test_start "Script inline présent (correctif v3.0.1)"
if docker exec $CONTAINER_NAME grep -q "window.toggleTheme" /usr/share/nginx/html/index.html 2>/dev/null; then
    test_pass "Fonction toggleTheme définie en inline"
else
    test_fail "Script inline manquant (version < 3.0.1 ?)"
    echo "  → Redéployez la stack pour obtenir le correctif"
fi

# Test 14: Fonction handleSTLUpload inline
test_start "Fonction handleSTLUpload inline"
if docker exec $CONTAINER_NAME grep -q "window.handleSTLUpload" /usr/share/nginx/html/index.html 2>/dev/null; then
    test_pass "Fonction handleSTLUpload définie en inline"
else
    test_fail "Fonction handleSTLUpload manquante"
fi

echo ""
echo "🔧 Vérification Nginx"
echo "--------------------"

# Test 15: Nginx version
test_start "Version de Nginx"
NGINX_VERSION=$(docker exec $CONTAINER_NAME nginx -v 2>&1 | cut -d'/' -f2)
if [ ! -z "$NGINX_VERSION" ]; then
    test_pass "Nginx $NGINX_VERSION"
else
    test_warn "Impossible de déterminer la version Nginx"
fi

# Test 16: Configuration Nginx
test_start "Configuration Nginx valide"
if docker exec $CONTAINER_NAME nginx -t 2>&1 | grep -q "syntax is ok"; then
    test_pass "Configuration valide"
else
    test_fail "Erreur dans la configuration Nginx"
fi

echo ""
echo "📈 Ressources du conteneur"
echo "-------------------------"

# Test 17: Utilisation mémoire
test_start "Utilisation de la mémoire"
MEM_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $CONTAINER_NAME 2>/dev/null | cut -d'/' -f1)
if [ ! -z "$MEM_USAGE" ]; then
    test_pass "$MEM_USAGE utilisés"
else
    test_warn "Impossible de lire l'utilisation mémoire"
fi

# Test 18: Utilisation CPU
test_start "Utilisation du CPU"
CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" $CONTAINER_NAME 2>/dev/null)
if [ ! -z "$CPU_USAGE" ]; then
    test_pass "$CPU_USAGE"
else
    test_warn "Impossible de lire l'utilisation CPU"
fi

echo ""
echo "======================================"
echo "📊 Résumé des Tests"
echo "======================================"
echo ""
echo "Total des tests   : $TOTAL_TESTS"
echo -e "${GREEN}Tests réussis     : $PASSED_TESTS${NC}"
echo -e "${RED}Tests échoués     : $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ Tous les tests sont passés avec succès !${NC}"
    echo ""
    echo "🎉 Le calculateur est prêt à être utilisé :"
    echo ""
    echo "   🌐 URL locale     : http://$HOST:$PORT"
    echo "   🧪 Tests auto     : http://$HOST:$PORT/test-auto.html"
    echo "   🔍 Diagnostic     : http://$HOST:$PORT/test-diagnostic.html"
    echo ""
    echo "⚠️  N'oubliez pas de vider le cache de votre navigateur !"
    echo "   Windows/Linux : Ctrl + Shift + R"
    echo "   Mac           : Cmd + Shift + R"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Certains tests ont échoué${NC}"
    echo ""
    echo "🔧 Actions recommandées :"
    echo ""
    echo "1. Vérifier les logs du conteneur :"
    echo "   docker logs $CONTAINER_NAME"
    echo ""
    echo "2. Redémarrer le conteneur :"
    echo "   docker restart $CONTAINER_NAME"
    echo ""
    echo "3. Redéployer depuis Portainer :"
    echo "   Stacks → $CONTAINER_NAME → Pull and redeploy"
    echo ""
    echo "4. Consulter la documentation :"
    echo "   cat TROUBLESHOOTING.md"
    echo "   cat CORRECTIF-DOCKER.md"
    echo ""
    exit 1
fi
