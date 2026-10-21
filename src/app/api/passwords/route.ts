import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const passwordsRes = await pool.query(
      'SELECT id, nama, ip, username, password, keterangan, created_at, updated_at FROM it_passwords ORDER BY id DESC'
    );
    const logsRes = await pool.query(
      'SELECT id, password_id, action, actor, detail, created_at FROM it_password_audit_logs ORDER BY id DESC LIMIT 50'
    );

    return NextResponse.json({
      success: true,
      data: passwordsRes.rows,
      logs: logsRes.rows,
    });
  } catch (error: any) {
    console.error('[API /api/passwords GET error]:', error);
    const errorMsg = error?.message || error?.code || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json(
      { success: false, error: errorMsg, code: error?.code, detail: error?.detail },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, ip, username, password, keterangan } = body;

    if (!nama || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Nama, username, dan password wajib diisi!' },
        { status: 400 }
      );
    }

    const insertRes = await pool.query(
      `INSERT INTO it_passwords (nama, ip, username, password, keterangan)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nama.trim(), ip?.trim() || null, username.trim(), password, keterangan?.trim() || null]
    );

    const newRecord = insertRes.rows[0];

    // Log audit
    await pool.query(
      `INSERT INTO it_password_audit_logs (password_id, action, actor, detail)
       VALUES ($1, $2, $3, $4)`,
      [
        newRecord.id,
        'CREATE',
        'IT Admin',
        `Menambahkan kredensial: "${newRecord.nama}" (${newRecord.username}) ${newRecord.ip ? 'IP: ' + newRecord.ip : ''}`,
      ]
    );

    return NextResponse.json({
      success: true,
      data: newRecord,
    });
  } catch (error: any) {
    console.error('[API /api/passwords GET error]:', error);
    const errorMsg = error?.message || error?.code || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json(
      { success: false, error: errorMsg, code: error?.code, detail: error?.detail },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nama, ip, username, password, keterangan } = body;

    if (!id || !nama || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'ID, nama, username, dan password wajib diisi!' },
        { status: 400 }
      );
    }

    // Get previous value for audit comparison
    const prevRes = await pool.query('SELECT * FROM it_passwords WHERE id = $1', [id]);
    if (prevRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Data password tidak ditemukan!' },
        { status: 404 }
      );
    }
    const prev = prevRes.rows[0];

    const updateRes = await pool.query(
      `UPDATE it_passwords
       SET nama = $1, ip = $2, username = $3, password = $4, keterangan = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [nama.trim(), ip?.trim() || null, username.trim(), password, keterangan?.trim() || null, id]
    );

    const updatedRecord = updateRes.rows[0];

    // Build changes summary for audit log
    const changes: string[] = [];
    if (prev.nama !== updatedRecord.nama) changes.push(`Nama diubah`);
    if (prev.ip !== updatedRecord.ip) changes.push(`IP: "${prev.ip || '-'}" -> "${updatedRecord.ip || '-'}"`);
    if (prev.username !== updatedRecord.username) changes.push(`Username diubah`);
    if (prev.password !== updatedRecord.password) changes.push(`Password diperbarui`);
    if (prev.keterangan !== updatedRecord.keterangan) changes.push(`Keterangan diperbarui`);

    const auditDetail = changes.length > 0
      ? `Mengubah akun "${updatedRecord.nama}": ` + changes.join(', ')
      : `Menyimpan ulang akun "${updatedRecord.nama}"`;

    await pool.query(
      `INSERT INTO it_password_audit_logs (password_id, action, actor, detail)
       VALUES ($1, $2, $3, $4)`,
      [id, 'UPDATE', 'IT Admin', auditDetail]
    );

    return NextResponse.json({
      success: true,
      data: updatedRecord,
    });
  } catch (error: any) {
    console.error('[API /api/passwords GET error]:', error);
    const errorMsg = error?.message || error?.code || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json(
      { success: false, error: errorMsg, code: error?.code, detail: error?.detail },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Parameter ID wajib disertakan!' },
        { status: 400 }
      );
    }

    const prevRes = await pool.query('SELECT nama, username, ip FROM it_passwords WHERE id = $1', [id]);
    const prev = prevRes.rows[0];

    await pool.query('DELETE FROM it_passwords WHERE id = $1', [id]);

    await pool.query(
      `INSERT INTO it_password_audit_logs (password_id, action, actor, detail)
       VALUES ($1, $2, $3, $4)`,
      [
        id,
        'DELETE',
        'IT Admin',
        `Menghapus kredensial: "${prev?.nama || id}" (${prev?.username || '-'}) ${prev?.ip ? 'IP: ' + prev.ip : ''}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Password berhasil dihapus',
    });
  } catch (error: any) {
    console.error('[API /api/passwords GET error]:', error);
    const errorMsg = error?.message || error?.code || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json(
      { success: false, error: errorMsg, code: error?.code, detail: error?.detail },
      { status: 500 }
    );
  }
}
