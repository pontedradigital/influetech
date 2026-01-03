
/**
 * Safely parses a Supabase column that might be an array, a JSON string, or a Postgres array string.
 * This is useful when the column type relies on client-side interpretation or legacy data.
 * @param data The raw data from the database column
 * @returns An array of strings
 */
export const parseDatabaseArray = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    if (typeof data === 'string') {
        const trimmed = data.trim();

        // Try JSON parse first
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // Not JSON
        }

        // Handle Postgres Array Format: {item1,item2}
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            // Remove braces
            const content = trimmed.substring(1, trimmed.length - 1);
            if (content.length === 0) return [];

            // This is a naive split by comma, handling quoted strings loosely
            // For complex CSV-like nesting, a regex is better, but this suffices for simple features
            return content.split(',').map(item => {
                // Remove surrounding quotes if present (e.g. "quoted string")
                let clean = item.trim();
                if (clean.startsWith('"') && clean.endsWith('"')) {
                    clean = clean.substring(1, clean.length - 1);
                }
                return clean;
            });
        }

        // Fallback: Split by newline if present, otherwise comma
        if (trimmed.includes('\n')) {
            return trimmed.split('\n').filter(Boolean);
        }

        return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }

    return [];
};
