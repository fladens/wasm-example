
export const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

export const taskStub = function(id) {
    return {
        id,
        assigned_to_id: Math.floor(Math.random() * 10),
        attachments_count: Math.floor(Math.random() * 10),
        closed_cl_items_count: Math.floor(Math.random() * 10),
        comments_count: Math.floor(Math.random() * 10),
        section_id: Math.floor(Math.random() * 10),
        sequence: Math.floor(Math.random() * 10000),
        status: Math.floor(Math.random() * 3),
        total_cl_items_count: Math.floor(Math.random() * 3),
        status_changed_by_id: Math.floor(Math.random() * 10000),
        completedAt: null,
        due: null,
        created_at: Date.now(),
        meta_information: null,
        name: "Test",
        notes: null,
        token: "TestToken",
        status_updated_at: Date.now(),
        updated_at: Date.now()
    };
};
