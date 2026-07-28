<?php

return [
    'accepted' => ':attribute harus disetujui.',
    'boolean' => ':attribute harus berupa ya atau tidak.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'current_password' => 'Password saat ini yang kamu masukkan tidak sesuai.',
    'email' => ':attribute harus berupa alamat email yang valid.',
    'exists' => ':attribute yang dipilih tidak valid.',
    'image' => ':attribute harus berupa gambar.',
    'max' => [
        'numeric' => ':attribute tidak boleh lebih dari :max.',
        'file' => ':attribute tidak boleh lebih dari :max kilobyte.',
        'string' => ':attribute tidak boleh lebih dari :max karakter.',
    ],
    'min' => [
        'numeric' => ':attribute minimal :min.',
        'file' => ':attribute minimal :min kilobyte.',
        'string' => ':attribute minimal :min karakter.',
    ],
    'lte' => [
        'numeric' => ':attribute harus lebih kecil atau sama dengan :value.',
    ],
    'numeric' => ':attribute harus berupa angka.',
    'required' => ':attribute wajib diisi.',
    'string' => ':attribute harus berupa teks.',
    'uploaded' => ':attribute gagal diunggah.',
    'url' => ':attribute harus berupa tautan yang valid.',

    'attributes' => [
        'name' => 'nama',
        'email' => 'email',
        'current_password' => 'password saat ini',
        'password' => 'password',
        'password_confirmation' => 'konfirmasi password',
        'category_id' => 'kategori',
        'title' => 'judul buku',
        'author' => 'penulis',
        'publisher' => 'penerbit',
        'isbn' => 'ISBN',
        'price_normal' => 'harga normal',
        'price_discount' => 'harga diskon',
        'cover' => 'cover',
        'drive_link' => 'link Google Drive',
        'description' => 'deskripsi',
        'is_active' => 'status aktif',
        'is_published' => 'status publikasi',
    ],
];
