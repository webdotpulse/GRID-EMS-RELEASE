# Comment obtenir un jeton GitHub (GitHub Token)

> 🌐 **Langue / Taal / Language:** [English](../github_token.md) | [Nederlands](../nl/github_token.md) | **Français**

Pour permettre à GEMS de rechercher et d'installer des mises à jour logicielles tout en évitant la limitation de débit par adresse IP (*rate limiting*) de l'API GitHub, vous pouvez renseigner un jeton d'accès personnel GitHub (*Personal Access Token (classic)*).

1. Accédez aux paramètres de votre compte GitHub (*Settings*).
2. Naviguez vers **Developer settings -> Personal access tokens -> Tokens (classic)**.
3. Générez un nouveau jeton. *(La permission `repo` n'est nécessaire que si le dépôt cible est privé).*
4. Copiez le jeton et collez-le dans l'interface GEMS sous **Paramètres -> Infos système**.
