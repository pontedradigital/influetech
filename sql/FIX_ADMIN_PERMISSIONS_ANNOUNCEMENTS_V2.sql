-- Enable Admins to Manage SystemAnnouncements (Insert, Update, Delete)
-- FIX: Cast auth.uid() to text because User.id is text

CREATE POLICY "Admins can manage SystemAnnouncement" ON "SystemAnnouncement"
    FOR ALL
    USING (
        exists (
            select 1 from "User" 
            where "User"."id" = auth.uid()::text 
            and "User"."role" = 'ADMIN'
        )
    );
