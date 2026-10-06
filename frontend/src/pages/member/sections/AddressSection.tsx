import { useState } from 'react'
import { useAsync } from '../../../hooks/useAsync'
import { createAddress, deleteAddress, getAddresses, updateAddress } from '../../../api/customer'
import { extractErrorMessage } from '../../../api/client'
import { Card, CardBody, CardHeader } from '../../../components/common/Card'
import { LoadingBlock } from '../../../components/common/Spinner'
import { Alert } from '../../../components/common/Alert'
import { EmptyState } from '../../../components/common/EmptyState'
import { Button } from '../../../components/common/Button'
import { Modal } from '../../../components/common/Modal'
import { Input } from '../../../components/common/Field'
import type { Address } from '../../../lib/types'
import type { AddressPayload } from '../../../api/types'
import { Icon } from '../../../components/common/Icon'

const EMPTY: AddressPayload = { address: '', label: '', is_default: false }

export function AddressSection() {
  const { data, loading, error, reload } = useAsync(() => getAddresses(), [])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [form, setForm] = useState<AddressPayload>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setFormError(null)
    setOpen(true)
  }

  function openEdit(address: Address) {
    setEditing(address)
    setForm({
      address: address.address,
      label: address.label ?? '',
      latitude: address.latitude,
      longitude: address.longitude,
      is_default: address.is_default,
    })
    setFormError(null)
    setOpen(true)
  }

  async function handleSave() {
    if (!form.address.trim()) {
      setFormError('Alamat wajib diisi.')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      if (editing) await updateAddress(editing.id, form)
      else await createAddress(form)
      setOpen(false)
      reload()
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(address: Address) {
    setDeletingId(address.id)
    try {
      await deleteAddress(address.id)
      reload()
    } catch {
      // cukup refresh; kesalahan ditangani lewat alert umum
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title="Buku Alamat"
          description="Simpan alamat penjemputan favorit agar booking lebih cepat."
          action={<Button size="sm" onClick={openCreate}>+ Tambah Alamat</Button>}
        />
        <CardBody className="space-y-4">
          {loading && <LoadingBlock />}
          {error && <Alert tone="error">{error}</Alert>}

          {!loading && data && data.length === 0 && (
            <EmptyState
              title="Belum ada alamat"
              description="Tambahkan alamat agar proses booking lebih cepat."
              icon={<Icon name="mapPin" size={26} />}
              action={<Button onClick={openCreate}>+ Tambah Alamat</Button>}
            />
          )}

          {data && data.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.map((address) => (
                <div key={address.id} className="rounded-xl border border-parchment-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-800">
                      <Icon name="mapPin" size={15} className="text-gold-500" />{' '}
                      {address.label || 'Alamat'}
                    </span>
                    {address.is_default && (
                      <span className="rounded-full bg-gold-50 px-2 py-0.5 text-xs font-medium text-gold-700">
                        Utama
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink-600">{address.address}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(address)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-600 hover:bg-rose-50"
                      loading={deletingId === address.id}
                      onClick={() => handleDelete(address)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Alamat' : 'Tambah Alamat'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button loading={saving} onClick={handleSave}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <Alert tone="error">{formError}</Alert>}
          <Input
            label="Label"
            placeholder="Rumah / Kantor"
            value={form.label ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
          />
          <Input
            label="Alamat Lengkap"
            required
            placeholder="Jalan, nomor, RT/RW, kelurahan, kota"
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={form.is_default ?? false}
              onChange={(e) => setForm((prev) => ({ ...prev, is_default: e.target.checked }))}
            />
            Jadikan alamat utama
          </label>
        </div>
      </Modal>
    </>
  )
}
