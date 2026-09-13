-- ==============================================================================
-- NOVA — Team Productivity Platform Database Schema
-- Compatible with Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE project_member_role AS ENUM ('OWNER', 'MEMBER');

-- 2. Profiles Table (Mirrors Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Project Members Table
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role project_member_role NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_project_member UNIQUE (project_id, user_id)
);

-- 5. Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'TODO',
    priority task_priority NOT NULL DEFAULT 'MEDIUM',
    assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Indexes for Performance
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- 7. Triggers for Automatic Updated_At
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 8. Auto-create Profile on Auth Sign-Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Helper security function to check project membership
CREATE OR REPLACE FUNCTION is_project_member(_project_id UUID, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM project_members
        WHERE project_id = _project_id AND user_id = _user_id
    ) OR EXISTS (
        SELECT 1 FROM projects
        WHERE id = _project_id AND owner_id = _user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Profiles readable by authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Users can view projects they own or belong to"
ON projects FOR SELECT
TO authenticated
USING (
    owner_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM project_members
        WHERE project_members.project_id = projects.id
        AND project_members.user_id = auth.uid()
    )
);

CREATE POLICY "Authenticated users can create projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects"
ON projects FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects"
ON projects FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Project Members Policies
CREATE POLICY "Members can view membership of projects they belong to"
ON project_members FOR SELECT
TO authenticated
USING (
    is_project_member(project_id, auth.uid())
);

CREATE POLICY "Project owners can add members"
ON project_members FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM projects
        WHERE id = project_members.project_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Project owners can remove members"
ON project_members FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM projects
        WHERE id = project_members.project_id AND owner_id = auth.uid()
    )
);

-- Tasks Policies
CREATE POLICY "Members can view project tasks"
ON tasks FOR SELECT
TO authenticated
USING (
    is_project_member(project_id, auth.uid())
);

CREATE POLICY "Members can create tasks in their projects"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (
    is_project_member(project_id, auth.uid())
);

CREATE POLICY "Members can update tasks in their projects"
ON tasks FOR UPDATE
TO authenticated
USING (
    is_project_member(project_id, auth.uid())
);

CREATE POLICY "Members can delete tasks in their projects"
ON tasks FOR DELETE
TO authenticated
USING (
    is_project_member(project_id, auth.uid())
);
