export const translateAuthError = (errorMessage: string): string => {
    if (!errorMessage) return 'Ocorreu um erro desconhecido.';

    const msg = errorMessage.toLowerCase();

    // Map of known Supabase/Auth errors to PT-BR
    if (msg.includes('invalid login credentials')) return 'Credenciais inválidas. Verifique seu e-mail e senha.';
    if (msg.includes('email not confirmed')) return 'E-mail não confirmado. Verifique sua caixa de entrada.';
    if (msg.includes('user not found')) return 'Usuário não encontrado.';
    if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
    if (msg.includes('auth session missing')) return 'Sessão de autenticação expirada ou inválida. Faça login novamente.';
    if (msg.includes('rate limit exceeded')) return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
    if (msg.includes('invalid refresh token')) return 'Sessão inválida. Faça login novamente.';
    if (msg.includes('already registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('signup disabled')) return 'Novos cadastros estão desativados no momento.';

    // Fallback for unmapped errors, but kept somewhat clean
    return errorMessage;
};
