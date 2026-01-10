-- Enable Admins to Manage SystemAnnouncements (Insert, Update, Delete)

CREATE POLICY "Admins can manage SystemAnnouncement" ON "SystemAnnouncement"
    FOR ALL
    USING (
        exists (
            select 1 from "User" 
            where "User"."id" = auth.uid() 
            and "User"."role" = 'ADMIN'
        )
    );
